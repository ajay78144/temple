// =============================================================================
// SAKOON TEMPLE — LIVE DARSHAN MODELS
// =============================================================================

/** Response shape returned by the Cloudflare Worker */
export interface LiveDarshanWorkerResponse {
  isLive: boolean;
  videoId: string | null;
  title: string | null;
  checkedAt: string; // ISO 8601
  channelId: string;
  error?: 'quota_exceeded' | 'api_error' | null;
}

/** Internal UI state for the Live Darshan component */
export interface LiveDarshanState {
  status: 'loading' | 'live' | 'offline' | 'error';
  videoId: string | null;
  title: string | null;
  embedUrl: string | null;        // sanitized SafeResourceUrl string placeholder
  lastChecked: Date | null;
  errorType: 'quota_exceeded' | 'api_error' | 'network' | null;
}

/** A spiritual program card shown below the player */
export interface SpiritualProgram {
  icon: string;
  name: string;
  hindiName: string;
  time: string;
  description: string;
  colorClass: string;
}

