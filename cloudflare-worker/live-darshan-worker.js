/**
 * Sakoon Temple – Live Darshan Cloudflare Worker
 *
 * Checks whether the configured YouTube channel is currently live-streaming
 * and returns a JSON payload to the website. Responses are cached in
 * Cloudflare's Cache API for 90 seconds to stay well within the
 * YouTube Data API v3 daily quota of 10,000 units (~960 real calls/day).
 *
 * Required environment bindings (set via wrangler.toml / Wrangler secrets):
 *   env.YOUTUBE_API_KEY     – YouTube Data API v3 key (Wrangler secret)
 *   env.YOUTUBE_CHANNEL_ID  – YouTube channel ID  (wrangler.toml [vars])
 *   env.ALLOWED_ORIGIN      – Allowed CORS origin  (wrangler.toml [vars])
 */

const CACHE_TTL_SECONDS = 90;

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------
export default {
  async fetch(request, env, ctx) {
    const allowedOrigin = env.ALLOWED_ORIGIN || "";

    // Handle CORS pre-flight
    if (request.method === "OPTIONS") {
      return handleOptions(allowedOrigin);
    }

    // Only GET is meaningful for this endpoint
    if (request.method !== "GET") {
      return jsonResponse(
        { error: "method_not_allowed" },
        405,
        allowedOrigin
      );
    }

    // --- Cache lookup ---
    const cache = caches.default;
    // Use a stable cache key (strip any query params the caller may add)
    const cacheKey = new Request(
      new URL("/live-darshan-status", request.url).toString(),
      { method: "GET" }
    );

    const cached = await cache.match(cacheKey);
    if (cached) {
      // Clone and re-attach CORS header in case the origin changed
      const body = await cached.json();
      return jsonResponse(body, 200, allowedOrigin);
    }

    // --- Call YouTube API ---
    const result = await fetchLiveStatus(env);

    // Build the response
    const response = jsonResponse(result, 200, allowedOrigin, CACHE_TTL_SECONDS);

    // Store in cache (ctx.waitUntil so we don't delay the caller)
    ctx.waitUntil(cache.put(cacheKey, response.clone()));

    return response;
  },
};

// ---------------------------------------------------------------------------
// YouTube live-status check
// ---------------------------------------------------------------------------
async function fetchLiveStatus(env) {
  const channelId = env.YOUTUBE_CHANNEL_ID || "";
  const apiKey = env.YOUTUBE_API_KEY || "";
  const checkedAt = new Date().toISOString();

  const basePayload = {
    isLive: false,
    videoId: null,
    title: null,
    checkedAt,
    channelId,
  };

  if (!apiKey || !channelId) {
    return { ...basePayload, error: "misconfigured" };
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("channelId", channelId);
  url.searchParams.set("eventType", "live");
  url.searchParams.set("type", "video");
  url.searchParams.set("part", "id,snippet");
  url.searchParams.set("maxResults", "1");

  let ytResponse;
  try {
    ytResponse = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      // Cloudflare Workers enforce a 30 s request timeout by default
      cf: { cacheTtl: 0 }, // bypass Cloudflare's own HTTP cache for the upstream call
    });
  } catch (networkErr) {
    return { ...basePayload, error: "api_error" };
  }

  // Handle quota / auth errors
  if (ytResponse.status === 403) {
    return { ...basePayload, error: "quota_exceeded" };
  }

  if (!ytResponse.ok) {
    return { ...basePayload, error: "api_error" };
  }

  let data;
  try {
    data = await ytResponse.json();
  } catch {
    return { ...basePayload, error: "api_error" };
  }

  // No live broadcast found
  if (!data.items || data.items.length === 0) {
    return basePayload;
  }

  const item = data.items[0];

  // Security: verify the returned video actually belongs to our channel
  const returnedChannelId = item.snippet?.channelId || "";
  if (returnedChannelId !== channelId) {
    // Channel mismatch – treat as no live stream
    return basePayload;
  }

  const videoId = item.id?.videoId || null;
  const title = item.snippet?.title || null;

  return {
    isLive: true,
    videoId,
    title,
    checkedAt,
    channelId,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a JSON Response with correct CORS and optional Cache-Control headers.
 * NOTE: The API key is never included in `body`.
 */
function jsonResponse(body, status, allowedOrigin, cacheTtl = 0) {
  const headers = new Headers({
    "Content-Type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "X-Content-Type-Options": "nosniff",
  });

  if (cacheTtl > 0) {
    headers.set("Cache-Control", `public, max-age=${cacheTtl}, s-maxage=${cacheTtl}`);
  } else {
    headers.set("Cache-Control", "no-store");
  }

  return new Response(JSON.stringify(body), { status, headers });
}

/** Handle CORS pre-flight OPTIONS request */
function handleOptions(allowedOrigin) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
