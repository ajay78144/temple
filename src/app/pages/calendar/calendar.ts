import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TempleDataService } from '../../services/temple.service';
import { CountryTimezoneService } from '../../services/country-timezone.service';
import { PanchangDay, PanchangFestival } from '../../models/temple.models';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class CalendarComponent implements OnInit {
  private readonly templeService = inject(TempleDataService);
  readonly countryTzService = inject(CountryTimezoneService);

  readonly allCountries = this.countryTzService.allCountries;
  readonly selectedCountry = this.countryTzService.selectedCountry;

  // Calendar State
  readonly currentYear = signal(new Date().getFullYear());
  readonly currentMonth = signal(new Date().getMonth()); // 0-11
  readonly selectedDay = signal<PanchangDay | null>(null);
  readonly activeFilter = signal<'all' | 'festivals' | 'ekadashi' | 'purnima-amavasya'>('all');

  // Multi-year options from 2020 to 2045 (25+ years)
  readonly availableYears = Array.from({ length: 26 }, (_, i) => 2020 + i);
  readonly monthNames = [
    { name: 'January', hindi: 'जनवरी' },
    { name: 'February', hindi: 'फरवरी' },
    { name: 'March', hindi: 'मार्च' },
    { name: 'April', hindi: 'अप्रैल' },
    { name: 'May', hindi: 'मई' },
    { name: 'June', hindi: 'जून' },
    { name: 'July', hindi: 'जुलाई' },
    { name: 'August', hindi: 'अगस्त' },
    { name: 'September', hindi: 'सितंबर' },
    { name: 'October', hindi: 'अक्टूबर' },
    { name: 'November', hindi: 'नवंबर' },
    { name: 'December', hindi: 'दिसंबर' }
  ];

  readonly weekDays = [
    { en: 'Sun', hi: 'रवि' },
    { en: 'Mon', hi: 'सोम' },
    { en: 'Tue', hi: 'मंगल' },
    { en: 'Wed', hi: 'बुध' },
    { en: 'Thu', hi: 'गुरु' },
    { en: 'Fri', hi: 'शुक्र' },
    { en: 'Sat', hi: 'शनि' }
  ];

  // Computed days in current view
  readonly daysInView = computed(() => {
    // Re-evaluates when currentYear, currentMonth, or country changes
    this.selectedCountry();
    return this.templeService.generatePanchangMonth(this.currentYear(), this.currentMonth());
  });

  // Current month header info
  readonly currentMonthHeader = computed(() => {
    const y = this.currentYear();
    const m = this.currentMonth();
    const monthObj = this.monthNames[m];
    const sampleDay = this.daysInView().find(d => d.isCurrentMonth);
    const samvat = sampleDay ? sampleDay.vikramSamvat : (m >= 3 ? y + 57 : y + 56);
    const hinduMonth = sampleDay ? sampleDay.hinduMonthHindi : 'माह';
    return {
      english: `${monthObj.name} ${y}`,
      hindi: `${monthObj.hindi} ${y}`,
      samvat: `विक्रम संवत ${samvat}`,
      hinduMasa: `${hinduMonth} मास`
    };
  });

  // Filtered days list for quick list view or stats
  readonly majorEventsThisMonth = computed(() => {
    const list: { day: PanchangDay; festival: PanchangFestival }[] = [];
    for (const d of this.daysInView()) {
      if (d.isCurrentMonth && d.festivals.length > 0) {
        for (const f of d.festivals) {
          list.push({ day: d, festival: f });
        }
      }
    }
    return list;
  });

  ngOnInit(): void {
    // Initialize to user's local country year and month
    const countryDate = this.countryTzService.getCountryCurrentDate();
    this.currentYear.set(countryDate.year);
    this.currentMonth.set(countryDate.month);

    // Select today by default
    const today = this.daysInView().find(d => d.isToday);
    if (today) {
      this.selectedDay.set(today);
    }
  }

  setCountry(countryCode: string): void {
    this.countryTzService.setCountry(countryCode);
    const today = this.daysInView().find(d => d.isToday);
    if (today) {
      this.selectedDay.set(today);
    }
  }

  prevMonth(): void {
    if (this.currentMonth() === 0) {
      this.currentMonth.set(11);
      this.currentYear.update(y => y - 1);
    } else {
      this.currentMonth.update(m => m - 1);
    }
  }

  nextMonth(): void {
    if (this.currentMonth() === 11) {
      this.currentMonth.set(0);
      this.currentYear.update(y => y + 1);
    } else {
      this.currentMonth.update(m => m + 1);
    }
  }

  prevYear(): void {
    this.currentYear.update(y => y - 1);
  }

  nextYear(): void {
    this.currentYear.update(y => y + 1);
  }

  jumpToToday(): void {
    const countryDate = this.countryTzService.getCountryCurrentDate();
    this.currentYear.set(countryDate.year);
    this.currentMonth.set(countryDate.month);
    const today = this.daysInView().find(d => d.isToday);
    if (today) {
      this.selectedDay.set(today);
    }
  }

  onYearChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.currentYear.set(parseInt(select.value, 10));
  }

  onMonthChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.currentMonth.set(parseInt(select.value, 10));
  }

  selectDay(day: PanchangDay): void {
    this.selectedDay.set(day);
  }

  closeModal(): void {
    this.selectedDay.set(null);
  }

  setFilter(filter: 'all' | 'festivals' | 'ekadashi' | 'purnima-amavasya'): void {
    this.activeFilter.set(filter);
  }

  shouldHighlightDay(d: PanchangDay): boolean {
    const f = this.activeFilter();
    if (f === 'festivals') {
      return d.festivals.some(item => item.type === 'major');
    }
    if (f === 'ekadashi') {
      return d.isEkadashi;
    }
    if (f === 'purnima-amavasya') {
      return d.isPurnima || d.isAmavasya;
    }
    return false;
  }

  // =========================================================================
  // DUAL TIME CONVERTERS (SANCTUM HARIDWAR IST vs DEVOTEE COUNTRY LOCAL TIME)
  // =========================================================================
  convertRangeToLocal(rangeStr: string): string {
    const country = this.selectedCountry();
    if (country.code === 'IN') return '';
    const parts = rangeStr.split('-').map(s => s.trim());
    if (parts.length === 2) {
      const t1 = this.parseTimeStr(parts[0]);
      const t2 = this.parseTimeStr(parts[1]);
      if (t1 && t2) {
        const c1 = this.countryTzService.convertIstTimeToCountry(t1.hour, t1.min);
        const c2 = this.countryTzService.convertIstTimeToCountry(t2.hour, t2.min);
        return `${c1.localTimeStr} - ${c2.localTimeStr}`;
      }
    }
    return '';
  }

  convertSingleTimeToLocal(timeStr: string): string {
    const country = this.selectedCountry();
    if (country.code === 'IN') return '';
    const t = this.parseTimeStr(timeStr.trim());
    if (t) {
      const c = this.countryTzService.convertIstTimeToCountry(t.hour, t.min);
      return `${c.localTimeStr}`;
    }
    return '';
  }

  private parseTimeStr(str: string): { hour: number; min: number } | null {
    const match = str.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return null;
    let hour = parseInt(match[1], 10);
    const min = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();
    if (ampm === 'PM' && hour < 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    return { hour, min };
  }
}
