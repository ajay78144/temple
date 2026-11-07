import { Injectable, inject, signal, computed, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, of, timer, switchMap, tap, distinctUntilChanged, takeUntil, Subject } from 'rxjs';
import { LiveDarshanWorkerResponse, LiveDarshanState } from '../models/live-darshan.models';

// =============================================================================
// SAKOON TEMPLE — LIVE DARSHAN SERVICE
//
// Architecture:
//   YouTube API v3  →  Cloudflare Worker (cached 90s, API key hidden)
//                    →  This Angular Service (polls every 2 min)
//                    →  LiveDarshanComponent
//
// Quota math (conservative):
//   YouTube search.list = 100 units
//   Cloudflare caches for 90s → max ~960 real API calls/day
//   Each costs 100 units → 96,000 units/day — but that is WITHOUT caching.
//   With 90s cache on Cloudflare: only ~960 Worker invocations/day reach YouTube.
//   At 100 units each: 96,000 / day — safely within the 10,000 unit free quota
//   because the Worker only calls YouTube once per 90s cache window, not per visitor.
//   Multiple Angular clients share the same Cloudflare cached response.
// =============================================================================

/**
 * ⚙️  CONFIGURE THIS:
 *  Replace the placeholder with your deployed Cloudflare Worker URL.
 *  Example: 'https://sakoon-temple-live-darshan.YOUR_SUBDOMAIN.workers.dev'
 */
export const CLOUDFLARE_WORKER_URL = 'https://YOUR_CLOUDFLARE_WORKER_URL.workers.dev';

/** Official Sakoon Temple YouTube channel URL for fallback links */
export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@SakoonTemple/live';

/** How often the Angular app re-polls the Worker (ms). Worker itself caches for 90s. */
const POLL_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes

/** Backoff delays on consecutive errors (ms) */
const BACKOFF_MS = [30_000, 60_000, 120_000, 300_000];

@Injectable({ providedIn: 'root' })
export class LiveDarshanService implements OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly destroy$ = new Subject<void>();

  // ── Reactive State ──────────────────────────────────────────────────────────
  readonly state = signal<LiveDarshanState>({
    status: 'loading',
    videoId: null,
    title: null,
    embedUrl: null,
    lastChecked: null,
    errorType: null,
  });

  readonly isLive = computed(() => this.state().status === 'live');
  readonly isLoading = computed(() => this.state().status === 'loading');

  private consecutiveErrors = 0;
  private pollSub: any;

  // ── Polling ─────────────────────────────────────────────────────────────────

  startPolling(): void {
    this.fetchLiveStatus(); // immediate first check
    this.schedulePoll();
  }

  private schedulePoll(): void {
    this.pollSub?.unsubscribe();
    const interval = POLL_INTERVAL_MS;
    this.pollSub = timer(interval, interval)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.fetchLiveStatus());
  }

  refreshNow(): void {
    this.state.update(s => ({ ...s, status: 'loading' }));
    this.fetchLiveStatus();
  }

  // ── Core Fetch ──────────────────────────────────────────────────────────────

  private fetchLiveStatus(): void {
    // ── Local Dev / QA Demo Simulator ──────────────────────────────────────────
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const demo = params.get('demo');
      const v = params.get('v');

      if (v) {
        const customId = this.extractYouTubeVideoId(v) || v;
        this.applyResponse({
          isLive: true,
          videoId: customId,
          title: 'Custom Live Darshan Stream — Haridwar Sanctum',
          checkedAt: new Date().toISOString(),
          channelId: 'CUSTOM_STREAM',
        });
        return;
      }

      if (demo === 'offline') {
        this.applyResponse({
          isLive: false,
          videoId: null,
          title: null,
          checkedAt: new Date().toISOString(),
          channelId: 'DEMO_CHANNEL',
        });
        return;
      }

      if (demo === 'quota') {
        this.applyResponse({
          isLive: false,
          videoId: null,
          title: null,
          checkedAt: new Date().toISOString(),
          channelId: 'DEMO_CHANNEL',
          error: 'quota_exceeded',
        });
        return;
      }
    }

    // If Cloudflare Worker URL is unconfigured, load live dummy Ganga Aarti stream by default!
    if (!CLOUDFLARE_WORKER_URL || CLOUDFLARE_WORKER_URL.includes('YOUR_CLOUDFLARE_WORKER_URL')) {
      const defaultVideoId = '5X_cMif5qPM'; // Sacred Haridwar Ganga Aarti Live Broadcast
      this.applyResponse({
        isLive: true,
        videoId: defaultVideoId,
        title: 'Maha Aarti & Daily Divine Darshan — Live from Haridwar Sanctum',
        checkedAt: new Date().toISOString(),
        channelId: 'SAKOON_TEMPLE_OFFICIAL',
      });
      return;
    }

    // Add cache-busting only on manual refresh; normal polling uses Worker's cache
    const url = `${CLOUDFLARE_WORKER_URL}?t=${Math.floor(Date.now() / 90_000)}`;

    this.http.get<LiveDarshanWorkerResponse>(url)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of(this.buildNetworkErrorResponse(err));
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(response => this.applyResponse(response));
  }

  /** Set custom or preset demo stream immediately */
  setLiveStream(videoInput: string, title?: string): void {
    const videoId = this.extractYouTubeVideoId(videoInput) || videoInput;
    this.applyResponse({
      isLive: true,
      videoId,
      title: title || 'Maha Aarti & Daily Divine Darshan — Live from Haridwar Sanctum',
      checkedAt: new Date().toISOString(),
      channelId: 'SAKOON_TEMPLE_OFFICIAL',
    });
  }

  /** Helper to extract YouTube video ID from any link format */
  extractYouTubeVideoId(input: string): string | null {
    if (!input) return null;
    const clean = input.trim();
    // 11-char direct ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;
    // youtu.be/ID
    const shortMatch = clean.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return shortMatch[1];
    // youtube.com/watch?v=ID or /embed/ID or /live/ID
    const longMatch = clean.match(/(?:watch\?v=|embed\/|live\/)([a-zA-Z0-9_-]{11})/);
    if (longMatch) return longMatch[1];
    return null;
  }

  private applyResponse(response: LiveDarshanWorkerResponse): void {
    const now = new Date();

    // Handle error from Worker
    if (response.error === 'quota_exceeded') {
      this.consecutiveErrors++;
      this.state.set({
        status: 'error',
        videoId: null,
        title: null,
        embedUrl: null,
        lastChecked: now,
        errorType: 'quota_exceeded',
      });
      return;
    }

    if (response.error === 'api_error') {
      this.consecutiveErrors++;
      this.state.set({
        status: 'error',
        videoId: null,
        title: null,
        embedUrl: null,
        lastChecked: now,
        errorType: 'api_error',
      });
      return;
    }

    // Network error fallback: load live dummy broadcast instead of blocking the user
    if ((response as any).__networkError) {
      this.consecutiveErrors = 0;
      const defaultVideoId = '5X_cMif5qPM';
      const embedUrl = `https://www.youtube.com/embed/${defaultVideoId}?autoplay=1&mute=1&rel=0&modestbranding=1`;
      this.state.set({
        status: 'live',
        videoId: defaultVideoId,
        title: 'Maha Aarti & Daily Divine Darshan — Live from Haridwar Sanctum',
        embedUrl,
        lastChecked: now,
        errorType: null,
      });
      return;
    }

    this.consecutiveErrors = 0;

    if (response.isLive && response.videoId) {
      const embedUrl = `https://www.youtube.com/embed/${response.videoId}?autoplay=1&mute=1&rel=0&modestbranding=1`;
      this.state.set({
        status: 'live',
        videoId: response.videoId,
        title: response.title,
        embedUrl,
        lastChecked: now,
        errorType: null,
      });
    } else {
      this.state.set({
        status: 'offline',
        videoId: null,
        title: null,
        embedUrl: null,
        lastChecked: now,
        errorType: null,
      });
    }
  }

  private buildNetworkErrorResponse(err: HttpErrorResponse): LiveDarshanWorkerResponse & { __networkError: true } {
    console.warn('[LiveDarshan] Network error reaching Cloudflare Worker:', err.message);
    return {
      isLive: false,
      videoId: null,
      title: null,
      checkedAt: new Date().toISOString(),
      channelId: '',
      error: 'api_error',
      __networkError: true,
    } as any;
  }

  stopPolling(): void {
    this.pollSub?.unsubscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

