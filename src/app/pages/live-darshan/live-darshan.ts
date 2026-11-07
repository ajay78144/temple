import {
  Component, inject, OnInit, OnDestroy, signal, computed, SecurityContext
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { LiveDarshanService, YOUTUBE_CHANNEL_URL } from '../../services/live-darshan.service';
import { SpiritualProgram } from '../../models/live-darshan.models';

export interface DummyStreamPreset {
  id: string;
  name: string;
  hindiName: string;
  icon: string;
}

@Component({
  selector: 'app-live-darshan',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './live-darshan.html',
  styleUrl: './live-darshan.css',
})
export class LiveDarshanComponent implements OnInit, OnDestroy {
  private readonly sanitizer = inject(DomSanitizer);
  readonly liveService = inject(LiveDarshanService);

  readonly youtubeChannelUrl = YOUTUBE_CHANNEL_URL;

  // ── Dummy Video Presets ─────────────────────────────────────────────────────
  readonly presets: DummyStreamPreset[] = [
    {
      id: '5X_cMif5qPM',
      name: 'Haridwar Maha Aarti',
      hindiName: 'हरिद्वार महा आरती',
      icon: '🪔',
    },
    {
      id: '_sAqci2REgw',
      name: 'Devotional Ganga Aarti',
      hindiName: 'दिव्य गंगा आरती',
      icon: '🌊',
    },
    {
      id: 'M7lc1UVf-VE',
      name: 'Vedic Shanti Mantra & Havan',
      hindiName: 'वैदिक शांति पाठ एवं हवन',
      icon: '🔥',
    },
  ];

  selectedPresetId = signal<string>('5X_cMif5qPM');
  customUrlInput = signal<string>('');
  inputError = signal<string | null>(null);

  // ── Computed Safe Embed URL ─────────────────────────────────────────────────
  readonly safeEmbedUrl = computed<SafeResourceUrl | null>(() => {
    const url = this.liveService.state().embedUrl;
    if (!url) return null;
    // Validate it's a YouTube embed URL before sanitizing
    if (!url.startsWith('https://www.youtube.com/embed/')) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  readonly state = this.liveService.state;
  readonly isLive = this.liveService.isLive;
  readonly isLoading = this.liveService.isLoading;

  // ── Spiritual Programs Data ─────────────────────────────────────────────────
  readonly programs: SpiritualProgram[] = [
    {
      icon: '🔥',
      name: 'Daily Havan',
      hindiName: 'दैनिक हवन',
      time: 'Morning & Evening',
      description: 'Sacred fire ritual with Vedic mantras for universal peace, health, and divine blessings.',
      colorClass: 'program-havan',
    },
    {
      icon: '🌅',
      name: 'Morning Aarti',
      hindiName: 'प्रातः आरती',
      time: '06:00 AM IST',
      description: 'Mangala Aarti welcoming the divine with sacred lamps, flowers, and devotional chants.',
      colorClass: 'program-morning',
    },
    {
      icon: '🌇',
      name: 'Evening Aarti',
      hindiName: 'सन्ध्या आरती',
      time: '07:00 PM IST',
      description: 'Maha Sandhya Aarti — a serene evening worship with diyas, incense, and hymns.',
      colorClass: 'program-evening',
    },
    {
      icon: '🪔',
      name: 'Special Puja',
      hindiName: 'विशेष पूजा',
      time: 'On Festive Days',
      description: 'Elaborate special pujas on ekadashi, purnima, amavasya, and major Hindu festivals.',
      colorClass: 'program-puja',
    },
  ];

  // ── Lifecycle ───────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.liveService.startPolling();
  }

  ngOnDestroy(): void {
    this.liveService.stopPolling();
  }

  onRefresh(): void {
    this.liveService.refreshNow();
  }

  // ── Switch Stream Preset ────────────────────────────────────────────────────
  selectPreset(preset: DummyStreamPreset): void {
    this.selectedPresetId.set(preset.id);
    this.inputError.set(null);
    this.liveService.setLiveStream(preset.id, `${preset.hindiName} — Sakoon Temple Live Darshan`);
  }

  // ── Apply Custom YouTube Link / ID ──────────────────────────────────────────
  applyCustomStream(): void {
    const input = this.customUrlInput().trim();
    if (!input) {
      this.inputError.set('Please enter a YouTube link or video ID.');
      return;
    }

    const videoId = this.liveService.extractYouTubeVideoId(input);
    if (!videoId) {
      this.inputError.set('Invalid YouTube link or video ID. Please check and try again.');
      return;
    }

    this.inputError.set(null);
    this.selectedPresetId.set(videoId);
    this.liveService.setLiveStream(videoId, 'Custom Stream Preview — Sakoon Temple Live Darshan');
  }

  formatLastChecked(date: Date | null): string {
    if (!date) return '';
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
}

