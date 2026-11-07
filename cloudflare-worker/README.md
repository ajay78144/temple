# Sakoon Temple – Live Darshan Cloudflare Worker

A lightweight Cloudflare Worker that checks whether the Sakoon Temple YouTube
channel is currently live-streaming and returns a JSON status to the website.
Responses are cached for **90 seconds** in Cloudflare's Cache API, keeping
real YouTube API calls to roughly **960 per day** — well within the free
quota of **10,000 units/day**.

---

## Response Shape

```json
{
  "isLive": true,
  "videoId": "abc123XYZ",
  "title": "Live Darshan – Sakoon Temple",
  "checkedAt": "2024-06-01T08:00:00.000Z",
  "channelId": "UCxxxxxxxxxxxxxxxxxxxxxx"
}
```

When no live stream is detected:

```json
{
  "isLive": false,
  "videoId": null,
  "title": null,
  "checkedAt": "2024-06-01T08:05:00.000Z",
  "channelId": "UCxxxxxxxxxxxxxxxxxxxxxx"
}
```

On API errors:

```json
{
  "isLive": false,
  "videoId": null,
  "title": null,
  "checkedAt": "2024-06-01T08:10:00.000Z",
  "error": "quota_exceeded",
  "channelId": "UCxxxxxxxxxxxxxxxxxxxxxx"
}
```

Possible `error` values: `quota_exceeded` | `api_error` | `misconfigured`

---

## Prerequisites

| Tool | Min version | Install |
|------|-------------|---------|
| Node.js | 18+ | https://nodejs.org |
| Wrangler CLI | 3.x | `npm install -g wrangler` |
| Cloudflare account (free) | — | https://dash.cloudflare.com/sign-up |
| Google Cloud account (free) | — | https://console.cloud.google.com |

---

## Step 1 – Find Your YouTube Channel ID

1. Go to [YouTube Studio](https://studio.youtube.com) → **Settings** → **Channel** → **Advanced settings**.
2. Copy the **Channel ID** (starts with `UC`, e.g. `UCxxxxxxxxxxxxxxxxxxxxxx`).

> [!TIP]
> Alternatively visit your channel page, click **More** → **Share** → **Copy channel ID**, or check the URL: `https://www.youtube.com/channel/<CHANNEL_ID>`.

---

## Step 2 – Create a YouTube Data API v3 Key

1. Open [Google Cloud Console](https://console.cloud.google.com).
2. Create a new project (e.g. **Sakoon Temple Live**).
3. Navigate to **APIs & Services** → **Library**.
4. Search for **YouTube Data API v3** and click **Enable**.
5. Go to **APIs & Services** → **Credentials** → **Create Credentials** → **API key**.
6. Copy the generated key.
7. **Restrict the key** (strongly recommended):
   - Under **API restrictions** → **Restrict key** → select **YouTube Data API v3**.
   - Under **Application restrictions** → **IP addresses** → add Cloudflare's
     [published IP ranges](https://www.cloudflare.com/ips/) **or** leave as
     *None* and rely on API restriction alone if IP pinning is impractical.
8. Click **Save**.

---

## Step 3 – Install Wrangler CLI

```bash
npm install -g wrangler
```

Verify:

```bash
wrangler --version
```

---

## Step 4 – Authenticate Wrangler with Cloudflare

```bash
wrangler login
```

Your browser will open. Log in with your Cloudflare account and grant access.

---

## Step 5 – Store the API Key as a Wrangler Secret

Secrets are encrypted at rest and **never** exposed in logs or responses.

```bash
wrangler secret put YOUTUBE_API_KEY
```

Paste your YouTube Data API v3 key when prompted, then press **Enter**.

---

## Step 6 – Set Your YouTube Channel ID

Open `wrangler.toml` and replace the placeholder:

```toml
[vars]
YOUTUBE_CHANNEL_ID = "UCxxxxxxxxxxxxxxxxxxxxxx"   # ← your real channel ID
ALLOWED_ORIGIN     = "YOUR_WEBSITE_ORIGIN_HERE"  # see Step 7
```

---

## Step 7 – Set the Allowed CORS Origin

Update `ALLOWED_ORIGIN` in `wrangler.toml` to match the exact origin of your
website (no trailing slash):

```toml
ALLOWED_ORIGIN = "https://sakoontemple.netlify.app"
```

> [!IMPORTANT]
> The value must be an **exact origin** (`scheme://host[:port]`). Do **not**
> use a wildcard (`*`) in production — that would allow any site to query
> your worker.

---

## Step 8 – Deploy the Worker

```bash
wrangler deploy
```

Wrangler will upload the worker and print the live URL, e.g.:

```
https://sakoon-temple-live-darshan.<your-subdomain>.workers.dev
```

---

## Step 9 – Test the Endpoint

Replace `<WORKER_URL>` with your worker's URL from Step 8.

**Check live status (curl):**

```bash
curl -s "https://<WORKER_URL>/" | python -m json.tool
```

**Check CORS pre-flight:**

```bash
curl -s -X OPTIONS "https://<WORKER_URL>/" \
  -H "Origin: https://sakoontemple.netlify.app" \
  -H "Access-Control-Request-Method: GET" \
  -D -
```

Expected preflight response headers:

```
HTTP/2 204
access-control-allow-origin: https://sakoontemple.netlify.app
access-control-allow-methods: GET, OPTIONS
access-control-max-age: 86400
```

**Confirm caching:** Call the endpoint twice within 90 seconds and verify
`checkedAt` is identical in both responses (served from cache).

---

## Step 10 – Use the Worker URL in Your Website

In your frontend JavaScript, fetch the status and embed the player:

```js
const WORKER_URL = "https://sakoon-temple-live-darshan.<your-subdomain>.workers.dev";

async function checkLiveDarshan() {
  try {
    const res = await fetch(WORKER_URL);
    const data = await res.json();

    if (data.isLive && data.videoId) {
      // Show embedded YouTube player
      document.getElementById("darshan-frame").src =
        `https://www.youtube.com/embed/${data.videoId}?autoplay=1`;
      document.getElementById("live-badge").style.display = "block";
    } else {
      document.getElementById("offline-msg").style.display = "block";
    }
  } catch (err) {
    console.error("Live Darshan check failed:", err);
  }
}

checkLiveDarshan();
// Refresh every 2 minutes (worker caches for 90 s, so at most 2 API calls/poll)
setInterval(checkLiveDarshan, 120_000);
```

---

## Step 11 – Monitor Quota Usage

1. Open [Google Cloud Console](https://console.cloud.google.com).
2. Go to **APIs & Services** → **YouTube Data API v3** → **Quotas**.
3. The `search.list` call costs **100 units** each. With a 90 s cache:
   - Max calls/day ≈ 86 400 / 90 = **960 calls**
   - Max units/day ≈ 960 × 100 = **96 000 units** (but free quota is 10 000)
   - Actual worst-case if the site is active 24 h:
     ≈ 960 Cloudflare Cache misses × 1 real API call = **960 API calls** = **96,000 units** — set an alert!

> [!WARNING]
> The 90-second Cloudflare cache is *per data-centre*. If your site receives
> traffic from many geographic regions simultaneously, each Cloudflare PoP may
> make its own upstream API call before the cache warms up. Consider:
> - Setting a **Cloudflare KV** store as a global cache layer, or
> - Enabling a **Durable Object** for a single global state, or
> - Increasing the cache TTL if near-real-time accuracy is not critical.

4. Set a **budget alert** in Google Cloud at 80 % of your quota to avoid
   unexpected overages.

---

## Environment Variables Reference

| Name | Where set | Example value |
|------|-----------|---------------|
| `YOUTUBE_API_KEY` | Wrangler secret | `AIzaSy…` |
| `YOUTUBE_CHANNEL_ID` | `wrangler.toml [vars]` | `UCxxxxxxxxxxxxxxxxxxxxxx` |
| `ALLOWED_ORIGIN` | `wrangler.toml [vars]` | `https://sakoontemple.netlify.app` |

---

## Updating the Worker

After any code change run:

```bash
wrangler deploy
```

To rotate the API key:

```bash
wrangler secret put YOUTUBE_API_KEY
```

---

## Local Development (optional)

```bash
wrangler dev
```

The worker runs at `http://localhost:8787`. Note that `caches.default` is a
no-op in local dev mode — cache behaviour is only active in production.
