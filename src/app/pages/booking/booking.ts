import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TempleDataService } from '../../services/temple.service';
import { CountryTimezoneService } from '../../services/country-timezone.service';
import { TempleService, BookingSlot, BookingRequest } from '../../models/temple.models';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.html',
  styleUrl: './booking.css'
})
export class BookingComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly templeService = inject(TempleDataService);
  readonly countryTzService = inject(CountryTimezoneService);

  readonly services = this.templeService.services;
  readonly allCountries = this.countryTzService.allCountries;
  readonly selectedCountry = this.countryTzService.selectedCountry;
  readonly currentStep = signal<1 | 2 | 3 | 4>(1);

  // International Devotee country selection
  selectedCountryCode = 'IN';
  phoneCode = '+91';

  // Form State
  selectedService = signal<TempleService | null>(null);
  selectedDateStr = signal<string>('');
  selectedSlot = signal<BookingSlot | null>(null);
  availableSlots = signal<BookingSlot[]>([]);
  slotPeriodFilter = signal<'All' | 'Morning' | 'Afternoon' | 'Evening'>('All');

  // Devotee Details
  devoteeName = '';
  phone = '';
  email = '';
  city = '';
  gotra = '';
  rashi = 'Not Sure / Shiva Gotra';
  attendanceMode = 'In-Person Sanctum Visit';
  birthDate = '';
  birthTime = '';
  birthPlace = '';
  priestPreference = 'Any Available Learned Vedic Priest';
  specialSankalpa = '';
  attendeesCount = 2;

  // Validation & Processing
  touched = signal<{ name: boolean; phone: boolean; email: boolean }>({
    name: false,
    phone: false,
    email: false
  });
  isSubmitting = signal(false);
  isPassCopied = signal(false);
  minDate = new Date().toISOString().split('T')[0];

  // Confirmation
  confirmedBooking = signal<BookingRequest | null>(null);
  recentBookings = signal<BookingRequest[]>([]);

  // Mini Calendar for date selection
  calendarMonth = signal(new Date().getMonth());
  calendarYear = signal(new Date().getFullYear());

  // Vedic Rashis list
  readonly rashisList = [
    'Mesha (मेष • Aries)',
    'Vrishabha (वृषभ • Taurus)',
    'Mithuna (मिथुन • Gemini)',
    'Karka (कर्क • Cancer)',
    'Simha (सिंह • Leo)',
    'Kanya (कन्या • Virgo)',
    'Tula (तुला • Libra)',
    'Vrishchika (वृश्चिक • Scorpio)',
    'Dhanu (धनु • Sagittarius)',
    'Makara (मकर • Capricorn)',
    'Kumbha (कुम्भ • Aquarius)',
    'Meena (मीन • Pisces)',
    'Not Sure / Shiva Gotra'
  ];

  ngOnInit(): void {
    // Default country from service
    const userCountry = this.countryTzService.selectedCountry();
    if (userCountry) {
      this.selectedCountryCode = userCountry.code;
      this.phoneCode = userCountry.phoneCode;
    }

    // Default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateFormatted = tomorrow.toISOString().split('T')[0];
    this.selectedDateStr.set(dateFormatted);
    this.loadSlotsForDate(dateFormatted);

    // Read query params for preselection
    this.route.queryParamMap.subscribe(params => {
      const sId = params.get('service');
      const dStr = params.get('date');

      if (sId) {
        const found = this.templeService.getServiceBySlug(sId);
        if (found) {
          this.selectedService.set(found);
          this.currentStep.set(2);
        }
      }

      if (dStr) {
        this.selectedDateStr.set(dStr);
        this.loadSlotsForDate(dStr);
      }
    });

    this.recentBookings.set(this.templeService.getRecentBookings());
  }

  onCountryChange(code: string): void {
    this.selectedCountryCode = code;
    const found = this.allCountries.find(c => c.code === code);
    if (found) {
      this.phoneCode = found.phoneCode;
      this.countryTzService.setCountry(code);
    }
  }

  convertSlotTimeToDevotee(slotTime: string): string {
    const country = this.selectedCountry();
    if (country.code === 'IN') return '';
    const parts = slotTime.split('-').map(s => s.trim());
    if (parts.length === 2) {
      const t1 = this.parseTime(parts[0]);
      const t2 = this.parseTime(parts[1]);
      if (t1 && t2) {
        const c1 = this.countryTzService.convertIstTimeToCountry(t1.hour, t1.min);
        const c2 = this.countryTzService.convertIstTimeToCountry(t2.hour, t2.min);
        return `${c1.localTimeStr} – ${c2.localTimeStr} (${country.timeZoneName})`;
      }
    }
    return '';
  }

  private parseTime(str: string): { hour: number; min: number } | null {
    const match = str.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return null;
    let hour = parseInt(match[1], 10);
    const min = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();
    if (ampm === 'PM' && hour < 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    return { hour, min };
  }

  selectService(svc: TempleService): void {
    this.selectedService.set(svc);
    this.currentStep.set(2);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  }

  loadSlotsForDate(dateStr: string): void {
    this.selectedDateStr.set(dateStr);
    const slots = this.templeService.getAvailableSlots(dateStr);
    this.availableSlots.set(slots);
    this.selectedSlot.set(null);
  }

  filteredSlots(): BookingSlot[] {
    const filter = this.slotPeriodFilter();
    const slots = this.availableSlots();
    if (filter === 'All') return slots;
    return slots.filter(s => s.period === filter);
  }

  selectSlot(slot: BookingSlot): void {
    if (slot.available) {
      this.selectedSlot.set(slot);
    }
  }

  proceedToDetails(): void {
    if (this.selectedSlot()) {
      this.currentStep.set(3);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 180, behavior: 'smooth' });
      }
    }
  }

  markTouched(field: 'name' | 'phone' | 'email'): void {
    this.touched.update(t => ({ ...t, [field]: true }));
  }

  isNameValid(): boolean {
    return this.devoteeName.trim().length >= 3;
  }

  isPhoneValid(): boolean {
    const clean = this.phone.replace(/[\s\-\(\)\+]/g, '');
    return clean.length >= 10;
  }

  isEmailValid(): boolean {
    if (!this.email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim());
  }

  submitBooking(): void {
    this.touched.set({ name: true, phone: true, email: true });

    if (!this.isNameValid() || !this.isPhoneValid() || !this.isEmailValid()) {
      if (typeof window !== 'undefined') {
        const errorInput = document.querySelector('.has-error input');
        if (errorInput) {
          (errorInput as HTMLElement).focus();
        }
      }
      return;
    }

    this.isSubmitting.set(true);

    setTimeout(() => {
      const svc = this.selectedService();
      const slot = this.selectedSlot();

      const request: BookingRequest = {
        serviceId: svc?.id || 'darshan',
        serviceName: svc?.title || 'Special Sanctum Darshan',
        date: this.selectedDateStr(),
        timeSlot: slot ? slot.time : '09:00 AM',
        devoteeName: this.devoteeName,
        phone: this.phone,
        email: this.email,
        city: this.city,
        gotra: this.gotra || 'Kashyap Gotra (Sarva Deva)',
        rashi: this.rashi,
        attendanceMode: this.attendanceMode,
        birthDate: this.birthDate,
        birthTime: this.birthTime,
        birthPlace: this.birthPlace,
        priestPreference: this.priestPreference,
        specialSankalpa: this.specialSankalpa,
        attendeesCount: this.attendeesCount
      };

      const result = this.templeService.saveBooking(request);
      this.confirmedBooking.set(result);
      this.isSubmitting.set(false);
      this.currentStep.set(4);
      this.recentBookings.set(this.templeService.getRecentBookings());
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 120, behavior: 'smooth' });
      }
    }, 650);
  }

  copyBookingRef(ref: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(ref).then(() => {
        this.isPassCopied.set(true);
        setTimeout(() => this.isPassCopied.set(false), 2500);
      });
    }
  }

  getWhatsAppShareUrl(bk: BookingRequest): string {
    const text = encodeURIComponent(
      `॥ श्री गणेशाय नमः ॥\n\n` +
      `Jai Shri Ram! My Puja appointment at Sakoon Temple is confirmed.\n\n` +
      `• Booking Pass ID: ${bk.bookingRef}\n` +
      `• Devotee Name: ${bk.devoteeName}\n` +
      `• Sacred Service: ${bk.serviceName}\n` +
      `• Date: ${bk.date}\n` +
      `• Time Window: ${bk.timeSlot}\n` +
      `• Gotra: ${bk.gotra || 'Kashyap'}\n` +
      `• Mode: ${bk.attendanceMode || 'In-Person'}\n` +
      `• Acharya: ${bk.priestPreference}\n\n` +
      `Har Har Mahadev!`
    );
    return `https://wa.me/919876543210?text=${text}`;
  }

  printReceipt(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }

  startNewBooking(): void {
    this.selectedService.set(null);
    this.selectedSlot.set(null);
    this.devoteeName = '';
    this.phone = '';
    this.email = '';
    this.city = '';
    this.gotra = '';
    this.rashi = 'Not Sure / Shiva Gotra';
    this.specialSankalpa = '';
    this.birthDate = '';
    this.birthTime = '';
    this.birthPlace = '';
    this.touched.set({ name: false, phone: false, email: false });
    this.confirmedBooking.set(null);
    this.currentStep.set(1);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  }
}
