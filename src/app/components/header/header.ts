import { Component, inject, signal, HostListener, OnInit, ElementRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TempleDataService } from '../../services/temple.service';
import { CountryTimezoneService } from '../../services/country-timezone.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent implements OnInit {
  private readonly elementRef = inject(ElementRef);
  private readonly templeService = inject(TempleDataService);
  readonly countryTzService = inject(CountryTimezoneService);

  readonly liveStatus = this.templeService.liveStatus;
  readonly allCountries = this.countryTzService.allCountries;
  readonly selectedCountry = this.countryTzService.selectedCountry;

  readonly isMobileMenuOpen = signal(false);
  readonly isScrolled = signal(false);
  readonly isCountryDropdownOpen = signal(false);
  readonly countrySearchQuery = signal('');
  readonly isSoundMuted = signal(true);
  readonly isBellAlertOpen = signal(false);

  // Web Audio Context for sacred ambient chime
  private audioCtx: AudioContext | null = null;
  private oscList: OscillatorNode[] = [];

  private isCheckingScroll = false;

  get filteredCountries() {
    const q = this.countrySearchQuery().toLowerCase().trim();
    if (!q) return this.allCountries;
    return this.allCountries.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.hindiName && c.hindiName.toLowerCase().includes(q)) ||
      c.code.toLowerCase().includes(q) ||
      c.timeZoneName.toLowerCase().includes(q)
    );
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.checkScroll();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (this.isCheckingScroll) return;
    this.isCheckingScroll = true;
    requestAnimationFrame(() => {
      this.checkScroll();
      this.isCheckingScroll = false;
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isCountryDropdownOpen()) {
      const clickedInside = this.elementRef.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.isCountryDropdownOpen.set(false);
      }
    }
  }

  @HostListener('window:keydown.escape', [])
  onEscapeKey(): void {
    if (this.isCountryDropdownOpen()) {
      this.isCountryDropdownOpen.set(false);
    }
    if (this.isMobileMenuOpen()) {
      this.isMobileMenuOpen.set(false);
    }
  }

  private checkScroll(): void {
    if (typeof window !== 'undefined') {
      const scrollPos = window.scrollY || document.documentElement.scrollTop || 0;
      // Scroll threshold with gentle hysteresis for smooth two-way animation
      if (scrollPos > 32) {
        if (!this.isScrolled()) this.isScrolled.set(true);
      } else if (scrollPos <= 10) {
        if (this.isScrolled()) this.isScrolled.set(false);
      }
    }
  }

  toggleSound(): void {
    if (typeof window === 'undefined') return;
    try {
      if (!this.audioCtx) {
        const AudioCtor = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtor) {
          this.audioCtx = new AudioCtor();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      if (this.isSoundMuted()) {
        if (this.audioCtx) {
          const osc1 = this.audioCtx.createOscillator();
          const osc2 = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);

          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(136.1, this.audioCtx.currentTime); // Sacred OM frequency
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(272.2, this.audioCtx.currentTime);

          const filter = this.audioCtx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(320, this.audioCtx.currentTime);

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc1.start();
          osc2.start();
          this.oscList = [osc1, osc2];
        }
        this.isSoundMuted.set(false);
      } else {
        this.oscList.forEach(osc => {
          try { osc.stop(); osc.disconnect(); } catch (e) {}
        });
        this.oscList = [];
        this.isSoundMuted.set(true);
      }
    } catch (e) {
      this.isSoundMuted.update(v => !v);
    }
  }

  toggleBellAlert(): void {
    this.isBellAlertOpen.update(v => !v);
  }

  toggleCountryDropdown(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isCountryDropdownOpen.update(v => !v);
  }

  selectCountry(countryCode: string): void {
    this.countryTzService.setCountry(countryCode);
    this.isCountryDropdownOpen.set(false);
    this.countrySearchQuery.set('');
  }

  toggleMobileMenu(): void {
    if (!this.isMobileMenuOpen()) {
      this.isCountryDropdownOpen.set(false);
    }
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
    this.isCountryDropdownOpen.set(false);
  }
}

