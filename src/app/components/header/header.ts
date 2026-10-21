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
    this.checkScroll();
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
      // Scroll Hysteresis: activates at 50px, only deactivates below 15px to prevent oscillation jitter
      if (scrollPos > 50) {
        if (!this.isScrolled()) this.isScrolled.set(true);
      } else if (scrollPos < 15) {
        if (this.isScrolled()) this.isScrolled.set(false);
      }
    }
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

