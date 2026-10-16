import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TempleDataService } from '../../services/temple.service';
import { PanchangDay, PanchangFestival } from '../../models/temple.models';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class CalendarComponent implements OnInit {
  private readonly templeService = inject(TempleDataService);

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
    // Select today by default
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
    const now = new Date();
    this.currentYear.set(now.getFullYear());
    this.currentMonth.set(now.getMonth());
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
}
