import { Injectable, signal, computed } from '@angular/core';
import { CountryConfig, ConvertedTimingSlot, InternationalLiveStatus } from '../models/country.models';

export const COUNTRIES_DATABASE: CountryConfig[] = [
  {
    code: 'IN',
    name: 'India',
    hindiName: 'भारत (तीर्थ धाम)',
    flag: '🇮🇳',
    timeZone: 'Asia/Kolkata',
    timeZoneName: 'IST (UTC+5:30)',
    phoneCode: '+91',
    currencySymbol: '₹',
    currencyCode: 'INR',
    currencyRateFromInr: 1,
    isDstSupported: false,
    region: 'Asia'
  },
  {
    code: 'US-NY',
    name: 'United States (Eastern - NY)',
    hindiName: 'अमेरिका (न्यूयॉर्क)',
    flag: '🇺🇸',
    timeZone: 'America/New_York',
    timeZoneName: 'EST / EDT (UTC-5 / -4)',
    phoneCode: '+1',
    currencySymbol: '$',
    currencyCode: 'USD',
    currencyRateFromInr: 0.012,
    isDstSupported: true,
    region: 'North America'
  },
  {
    code: 'US-CHI',
    name: 'United States (Central - Chicago)',
    hindiName: 'अमेरिका (शिकागो)',
    flag: '🇺🇸',
    timeZone: 'America/Chicago',
    timeZoneName: 'CST / CDT (UTC-6 / -5)',
    phoneCode: '+1',
    currencySymbol: '$',
    currencyCode: 'USD',
    currencyRateFromInr: 0.012,
    isDstSupported: true,
    region: 'North America'
  },
  {
    code: 'US-LA',
    name: 'United States (Pacific - LA)',
    hindiName: 'अमेरिका (लॉस एंजेलिस)',
    flag: '🇺🇸',
    timeZone: 'America/Los_Angeles',
    timeZoneName: 'PST / PDT (UTC-8 / -7)',
    phoneCode: '+1',
    currencySymbol: '$',
    currencyCode: 'USD',
    currencyRateFromInr: 0.012,
    isDstSupported: true,
    region: 'North America'
  },
  {
    code: 'GB',
    name: 'United Kingdom (London)',
    hindiName: 'यूनाइटेड किंगडम (लंदन)',
    flag: '🇬🇧',
    timeZone: 'Europe/London',
    timeZoneName: 'GMT / BST (UTC+0 / +1)',
    phoneCode: '+44',
    currencySymbol: '£',
    currencyCode: 'GBP',
    currencyRateFromInr: 0.0095,
    isDstSupported: true,
    region: 'Europe'
  },
  {
    code: 'CA-TOR',
    name: 'Canada (Toronto)',
    hindiName: 'कनाडा (टोरंटो)',
    flag: '🇨🇦',
    timeZone: 'America/Toronto',
    timeZoneName: 'EST / EDT (UTC-5 / -4)',
    phoneCode: '+1',
    currencySymbol: 'C$',
    currencyCode: 'CAD',
    currencyRateFromInr: 0.016,
    isDstSupported: true,
    region: 'North America'
  },
  {
    code: 'CA-VAN',
    name: 'Canada (Vancouver)',
    hindiName: 'कनाडा (वैंकूवर)',
    flag: '🇨🇦',
    timeZone: 'America/Vancouver',
    timeZoneName: 'PST / PDT (UTC-8 / -7)',
    phoneCode: '+1',
    currencySymbol: 'C$',
    currencyCode: 'CAD',
    currencyRateFromInr: 0.016,
    isDstSupported: true,
    region: 'North America'
  },
  {
    code: 'AU-SYD',
    name: 'Australia (Sydney)',
    hindiName: 'ऑस्ट्रेलिया (सिडनी)',
    flag: '🇦🇺',
    timeZone: 'Australia/Sydney',
    timeZoneName: 'AEST / AEDT (UTC+10 / +11)',
    phoneCode: '+61',
    currencySymbol: 'A$',
    currencyCode: 'AUD',
    currencyRateFromInr: 0.018,
    isDstSupported: true,
    region: 'Oceania'
  },
  {
    code: 'AU-MEL',
    name: 'Australia (Melbourne)',
    hindiName: 'ऑस्ट्रेलिया (मेलबर्न)',
    flag: '🇦🇺',
    timeZone: 'Australia/Melbourne',
    timeZoneName: 'AEST / AEDT (UTC+10 / +11)',
    phoneCode: '+61',
    currencySymbol: 'A$',
    currencyCode: 'AUD',
    currencyRateFromInr: 0.018,
    isDstSupported: true,
    region: 'Oceania'
  },
  {
    code: 'AU-PER',
    name: 'Australia (Perth)',
    hindiName: 'ऑस्ट्रेलिया (पर्थ)',
    flag: '🇦🇺',
    timeZone: 'Australia/Perth',
    timeZoneName: 'AWST (UTC+8)',
    phoneCode: '+61',
    currencySymbol: 'A$',
    currencyCode: 'AUD',
    currencyRateFromInr: 0.018,
    isDstSupported: false,
    region: 'Oceania'
  },
  {
    code: 'AE',
    name: 'United Arab Emirates (Dubai)',
    hindiName: 'संयुक्त अरब अमीरात (दुबई)',
    flag: '🇦🇪',
    timeZone: 'Asia/Dubai',
    timeZoneName: 'GST (UTC+4)',
    phoneCode: '+971',
    currencySymbol: 'AED',
    currencyCode: 'AED',
    currencyRateFromInr: 0.044,
    isDstSupported: false,
    region: 'Middle East'
  },
  {
    code: 'SG',
    name: 'Singapore',
    hindiName: 'सिंगापुर',
    flag: '🇸🇬',
    timeZone: 'Asia/Singapore',
    timeZoneName: 'SGT (UTC+8)',
    phoneCode: '+65',
    currencySymbol: 'S$',
    currencyCode: 'SGD',
    currencyRateFromInr: 0.016,
    isDstSupported: false,
    region: 'Asia'
  },
  {
    code: 'NP',
    name: 'Nepal (Kathmandu)',
    hindiName: 'नेपाल (काठमांडू)',
    flag: '🇳🇵',
    timeZone: 'Asia/Kathmandu',
    timeZoneName: 'NPT (UTC+5:45)',
    phoneCode: '+977',
    currencySymbol: 'रू',
    currencyCode: 'NPR',
    currencyRateFromInr: 1.6,
    isDstSupported: false,
    region: 'Asia'
  },
  {
    code: 'MY',
    name: 'Malaysia (Kuala Lumpur)',
    hindiName: 'मलेशिया',
    flag: '🇲🇾',
    timeZone: 'Asia/Kuala_Lumpur',
    timeZoneName: 'MYT (UTC+8)',
    phoneCode: '+60',
    currencySymbol: 'RM',
    currencyCode: 'MYR',
    currencyRateFromInr: 0.056,
    isDstSupported: false,
    region: 'Asia'
  },
  {
    code: 'DE',
    name: 'Germany (Berlin / Frankfurt)',
    hindiName: 'जर्मनी (बर्लिन)',
    flag: '🇩🇪',
    timeZone: 'Europe/Berlin',
    timeZoneName: 'CET / CEST (UTC+1 / +2)',
    phoneCode: '+49',
    currencySymbol: '€',
    currencyCode: 'EUR',
    currencyRateFromInr: 0.011,
    isDstSupported: true,
    region: 'Europe'
  },
  {
    code: 'FR',
    name: 'France (Paris)',
    hindiName: 'फ्रांस (पेरिस)',
    flag: '🇫🇷',
    timeZone: 'Europe/Paris',
    timeZoneName: 'CET / CEST (UTC+1 / +2)',
    phoneCode: '+33',
    currencySymbol: '€',
    currencyCode: 'EUR',
    currencyRateFromInr: 0.011,
    isDstSupported: true,
    region: 'Europe'
  },
  {
    code: 'NL',
    name: 'Netherlands (Amsterdam)',
    hindiName: 'नीदरलैंड (एम्स्टर्डम)',
    flag: '🇳🇱',
    timeZone: 'Europe/Amsterdam',
    timeZoneName: 'CET / CEST (UTC+1 / +2)',
    phoneCode: '+31',
    currencySymbol: '€',
    currencyCode: 'EUR',
    currencyRateFromInr: 0.011,
    isDstSupported: true,
    region: 'Europe'
  },
  {
    code: 'IE',
    name: 'Ireland (Dublin)',
    hindiName: 'आयरलैंड (डबलिन)',
    flag: '🇮🇪',
    timeZone: 'Europe/Dublin',
    timeZoneName: 'GMT / IST (UTC+0 / +1)',
    phoneCode: '+353',
    currencySymbol: '€',
    currencyCode: 'EUR',
    currencyRateFromInr: 0.011,
    isDstSupported: true,
    region: 'Europe'
  },
  {
    code: 'MU',
    name: 'Mauritius (Port Louis)',
    hindiName: 'मॉरीशस',
    flag: '🇲🇺',
    timeZone: 'Indian/Mauritius',
    timeZoneName: 'MUT (UTC+4)',
    phoneCode: '+230',
    currencySymbol: 'Rs',
    currencyCode: 'MUR',
    currencyRateFromInr: 0.55,
    isDstSupported: false,
    region: 'Africa'
  },
  {
    code: 'NZ',
    name: 'New Zealand (Auckland)',
    hindiName: 'न्यूजीलैंड (ऑकलैंड)',
    flag: '🇳🇿',
    timeZone: 'Pacific/Auckland',
    timeZoneName: 'NZST / NZDT (UTC+12 / +13)',
    phoneCode: '+64',
    currencySymbol: 'NZ$',
    currencyCode: 'NZD',
    currencyRateFromInr: 0.019,
    isDstSupported: true,
    region: 'Oceania'
  },
  {
    code: 'ZA',
    name: 'South Africa (Johannesburg / Durban)',
    hindiName: 'दक्षिण अफ्रीका',
    flag: '🇿🇦',
    timeZone: 'Africa/Johannesburg',
    timeZoneName: 'SAST (UTC+2)',
    phoneCode: '+27',
    currencySymbol: 'R',
    currencyCode: 'ZAR',
    currencyRateFromInr: 0.22,
    isDstSupported: false,
    region: 'Africa'
  },
  {
    code: 'FJ',
    name: 'Fiji (Suva)',
    hindiName: 'फ़िजी',
    flag: '🇫🇯',
    timeZone: 'Pacific/Fiji',
    timeZoneName: 'FJT (UTC+12)',
    phoneCode: '+679',
    currencySymbol: 'FJ$',
    currencyCode: 'FJD',
    currencyRateFromInr: 0.027,
    isDstSupported: false,
    region: 'Oceania'
  },
  {
    code: 'TT',
    name: 'Trinidad and Tobago',
    hindiName: 'त्रिनिदाद और टोबैगो',
    flag: '🇹🇹',
    timeZone: 'America/Port_of_Spain',
    timeZoneName: 'AST (UTC-4)',
    phoneCode: '+1868',
    currencySymbol: 'TT$',
    currencyCode: 'TTD',
    currencyRateFromInr: 0.081,
    isDstSupported: false,
    region: 'North America'
  },
  {
    code: 'GY',
    name: 'Guyana',
    hindiName: 'गुयाना',
    flag: '🇬🇾',
    timeZone: 'America/Guyana',
    timeZoneName: 'GYT (UTC-4)',
    phoneCode: '+592',
    currencySymbol: 'G$',
    currencyCode: 'GYD',
    currencyRateFromInr: 2.5,
    isDstSupported: false,
    region: 'North America'
  },
  {
    code: 'QA',
    name: 'Qatar (Doha)',
    hindiName: 'कतर (दोहा)',
    flag: '🇶🇦',
    timeZone: 'Asia/Qatar',
    timeZoneName: 'AST (UTC+3)',
    phoneCode: '+974',
    currencySymbol: 'QR',
    currencyCode: 'QAR',
    currencyRateFromInr: 0.044,
    isDstSupported: false,
    region: 'Middle East'
  },
  {
    code: 'SA',
    name: 'Saudi Arabia (Riyadh)',
    hindiName: 'सऊदी अरब',
    flag: '🇸🇦',
    timeZone: 'Asia/Riyadh',
    timeZoneName: 'AST (UTC+3)',
    phoneCode: '+966',
    currencySymbol: 'SR',
    currencyCode: 'SAR',
    currencyRateFromInr: 0.045,
    isDstSupported: false,
    region: 'Middle East'
  },
  {
    code: 'KW',
    name: 'Kuwait',
    hindiName: 'कुवैत',
    flag: '🇰🇼',
    timeZone: 'Asia/Kuwait',
    timeZoneName: 'AST (UTC+3)',
    phoneCode: '+965',
    currencySymbol: 'KD',
    currencyCode: 'KWD',
    currencyRateFromInr: 0.0037,
    isDstSupported: false,
    region: 'Middle East'
  },
  {
    code: 'OM',
    name: 'Oman (Muscat)',
    hindiName: 'ओमान (मस्कट)',
    flag: '🇴🇲',
    timeZone: 'Asia/Muscat',
    timeZoneName: 'GST (UTC+4)',
    phoneCode: '+968',
    currencySymbol: 'OMR',
    currencyCode: 'OMR',
    currencyRateFromInr: 0.0046,
    isDstSupported: false,
    region: 'Middle East'
  },
  {
    code: 'ID',
    name: 'Indonesia (Bali)',
    hindiName: 'इंडोनेशिया (बाली)',
    flag: '🇮🇩',
    timeZone: 'Asia/Makassar',
    timeZoneName: 'WITA (UTC+8)',
    phoneCode: '+62',
    currencySymbol: 'Rp',
    currencyCode: 'IDR',
    currencyRateFromInr: 188,
    isDstSupported: false,
    region: 'Asia'
  },
  {
    code: 'JP',
    name: 'Japan (Tokyo)',
    hindiName: 'जापान (टोक्यो)',
    flag: '🇯🇵',
    timeZone: 'Asia/Tokyo',
    timeZoneName: 'JST (UTC+9)',
    phoneCode: '+81',
    currencySymbol: '¥',
    currencyCode: 'JPY',
    currencyRateFromInr: 1.8,
    isDstSupported: false,
    region: 'Asia'
  }
];

const STORAGE_KEY = 'sakoon_devotee_selected_country';

@Injectable({
  providedIn: 'root'
})
export class CountryTimezoneService {
  readonly allCountries: CountryConfig[] = COUNTRIES_DATABASE;

  // Selected Country Signal
  readonly selectedCountry = signal<CountryConfig>(COUNTRIES_DATABASE[0]);

  // Current system tick (updates every second)
  readonly currentTimestamp = signal<Date>(new Date());

  // Temple IST Timezone is fixed to Haridwar
  readonly TEMPLE_TIMEZONE = 'Asia/Kolkata';

  constructor() {
    this.initCountryPreference();

    // Start 1-second live clock update
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.currentTimestamp.set(new Date());
      }, 1000);
    }
  }

  private initCountryPreference(): void {
    if (typeof window === 'undefined') return;

    // 1. Check local storage
    try {
      const savedCode = localStorage.getItem(STORAGE_KEY);
      if (savedCode) {
        const found = this.allCountries.find(c => c.code === savedCode);
        if (found) {
          this.selectedCountry.set(found);
          return;
        }
      }
    } catch {
      // ignore storage access issues
    }

    // 2. Auto-detect visitor's timezone
    try {
      const detectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detectedTz) {
        // Find exact or closest matching country
        const match = this.allCountries.find(c => c.timeZone === detectedTz);
        if (match) {
          this.selectedCountry.set(match);
          return;
        }

        // Region based fuzzy fallback (e.g. America/* -> US, Europe/* -> GB/DE)
        if (detectedTz.startsWith('America/')) {
          const usMatch = this.allCountries.find(c => c.code === 'US-NY');
          if (usMatch) { this.selectedCountry.set(usMatch); return; }
        } else if (detectedTz.startsWith('Europe/')) {
          const ukMatch = this.allCountries.find(c => c.code === 'GB');
          if (ukMatch) { this.selectedCountry.set(ukMatch); return; }
        } else if (detectedTz.startsWith('Australia/')) {
          const auMatch = this.allCountries.find(c => c.code === 'AU-SYD');
          if (auMatch) { this.selectedCountry.set(auMatch); return; }
        }
      }
    } catch {
      // fallback to India
    }

    // Default to India
    this.selectedCountry.set(COUNTRIES_DATABASE[0]);
  }

  setCountry(countryCode: string): void {
    const match = this.allCountries.find(c => c.code === countryCode);
    if (match) {
      this.selectedCountry.set(match);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, match.code);
        } catch {
          // ignore
        }
      }
    }
  }

  // =========================================================================
  // DYNAMIC COMPUTED TIME & CLOCK SIGNALS
  // =========================================================================

  /**
   * Temple Haridwar Time (IST)
   */
  readonly templeIstClock = computed(() => {
    const now = this.currentTimestamp();
    const timeStr = this.formatInTz(now, this.TEMPLE_TIMEZONE, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    const dateStr = this.formatInTz(now, this.TEMPLE_TIMEZONE, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    return { timeStr, dateStr };
  });

  /**
   * Devotee's Selected Country Local Time
   */
  readonly countryClock = computed(() => {
    const now = this.currentTimestamp();
    const tz = this.selectedCountry().timeZone;
    const timeStr = this.formatInTz(now, tz, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    const dateStr = this.formatInTz(now, tz, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    return { timeStr, dateStr };
  });

  /**
   * Detects whether Daylight Saving Time (1-hour difference) is currently active
   * in the selected country timezone.
   */
  readonly isDstActive = computed(() => {
    const country = this.selectedCountry();
    if (!country.isDstSupported) return false;
    return this.checkIsDst(country.timeZone);
  });

  /**
   * Calculates time offset difference between Selected Country and Temple Haridwar (IST)
   */
  readonly timeDifferenceNotice = computed(() => {
    const country = this.selectedCountry();
    if (country.code === 'IN') {
      return {
        isSameAsTemple: true,
        diffHours: 0,
        diffMinutes: 0,
        text: 'Sanctum Live Time (IST)',
        subText: 'Haridwar Divine Time'
      };
    }

    const now = this.currentTimestamp();
    const diffMs = this.getTimezoneOffsetDiffMs(this.TEMPLE_TIMEZONE, country.timeZone, now);
    const totalMinutes = Math.round(diffMs / 60000);
    const absMinutes = Math.abs(totalMinutes);
    const hours = Math.floor(absMinutes / 60);
    const mins = absMinutes % 60;

    const isBehind = totalMinutes < 0;
    const signText = isBehind ? 'behind Haridwar' : 'ahead of Haridwar';
    const minText = mins > 0 ? ` ${mins}m` : '';

    return {
      isSameAsTemple: false,
      diffHours: hours,
      diffMinutes: mins,
      isBehind,
      text: `${hours}h${minText} ${signText}`,
      subText: isBehind
        ? `When it is evening in Haridwar, it is earlier in ${country.name}`
        : `Your local time is ahead of Haridwar Sanctum`
    };
  });

  /**
   * Get Current Date Object in Selected Country Timezone
   * Essential for Panchang & Calendar so "Today" matches user's local date!
   */
  getCountryCurrentDate(): { year: number; month: number; day: number; fullDate: Date } {
    const now = this.currentTimestamp();
    const tz = this.selectedCountry().timeZone;
    
    // Format YYYY-MM-DD in selected timezone
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    const parts = formatter.format(now).split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-indexed
    const day = parseInt(parts[2], 10);

    return {
      year,
      month,
      day,
      fullDate: new Date(year, month, day)
    };
  }

  // =========================================================================
  // PRECISION TIMEZONE & TIMING CONVERTER
  // =========================================================================

  /**
   * Converts a fixed Haridwar (IST) time into the selected country's local time.
   * Accurately handles Daylight Saving Time (DST) 1-hour changes!
   */
  convertIstTimeToCountry(istHour: number, istMin: number): {
    localTimeStr: string;
    dayOffsetNote: string;
    hours: number;
    minutes: number;
  } {
    const country = this.selectedCountry();
    if (country.code === 'IN') {
      const h12 = istHour % 12 || 12;
      const ampm = istHour >= 12 ? 'PM' : 'AM';
      const mStr = istMin < 10 ? `0${istMin}` : `${istMin}`;
      return {
        localTimeStr: `${h12}:${mStr} ${ampm} IST`,
        dayOffsetNote: 'Sanctum Time',
        hours: istHour,
        minutes: istMin
      };
    }

    // Reference today date in IST
    const now = new Date();
    // Create UTC date string for given IST time
    // IST is UTC+5:30 -> UTC is IST - 5:30
    const istYear = now.getUTCFullYear();
    const istMonth = now.getUTCMonth();
    const istDay = now.getUTCDate();

    // Create an exact instant by parsing in IST
    // We can do this cleanly: 
    // Construct an ISO string assuming Indian standard date
    // e.g. 2026-10-21T06:00:00+05:30
    const mStr = istMin < 10 ? `0${istMin}` : `${istMin}`;
    const hStr = istHour < 10 ? `0${istHour}` : `${istHour}`;
    const isoString = `${istYear}-${String(istMonth + 1).padStart(2, '0')}-${String(istDay).padStart(2, '0')}T${hStr}:${mStr}:00+05:30`;
    
    const targetDate = new Date(isoString);

    // Format in country timezone
    const localTimeStr = this.formatInTz(targetDate, country.timeZone, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Check date difference between IST date and target timezone date
    const istDateFormatted = this.formatInTz(targetDate, this.TEMPLE_TIMEZONE, { day: 'numeric' });
    const localDateFormatted = this.formatInTz(targetDate, country.timeZone, { day: 'numeric' });

    let dayOffsetNote = 'Same Day';
    const istDayNum = parseInt(istDateFormatted, 10);
    const localDayNum = parseInt(localDateFormatted, 10);

    if (localDayNum < istDayNum || (istDayNum === 1 && localDayNum > 27)) {
      dayOffsetNote = 'Previous Day';
    } else if (localDayNum > istDayNum || (istDayNum > 27 && localDayNum === 1)) {
      dayOffsetNote = 'Next Day';
    }

    return {
      localTimeStr: `${localTimeStr}`,
      dayOffsetNote,
      hours: targetDate.getHours(),
      minutes: targetDate.getMinutes()
    };
  }

  /**
   * Helper to format any date into specific IANA timezone
   */
  formatInTz(date: Date, timeZone: string, options: Intl.DateTimeFormatOptions): string {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone,
        ...options
      }).format(date);
    } catch {
      return date.toLocaleTimeString('en-US', options);
    }
  }

  /**
   * Computes difference in milliseconds between two timezones at a given date instant
   */
  private getTimezoneOffsetDiffMs(tzA: string, tzB: string, date: Date): number {
    const dateA = new Date(date.toLocaleString('en-US', { timeZone: tzA }));
    const dateB = new Date(date.toLocaleString('en-US', { timeZone: tzB }));
    return dateB.getTime() - dateA.getTime();
  }

  /**
   * Check if daylight saving time is active by comparing standard January vs July offsets
   */
  private checkIsDst(timeZone: string): boolean {
    try {
      const year = new Date().getFullYear();
      const jan = new Date(year, 0, 1);
      const jul = new Date(year, 6, 1);
      
      const getOffset = (d: Date) => {
        const str = d.toLocaleString('en-US', { timeZone, timeZoneName: 'short' });
        return str;
      };

      const nowStr = new Date().toLocaleString('en-US', { timeZone, timeZoneName: 'short' });
      const janStr = getOffset(jan);
      const julStr = getOffset(jul);

      // If January and July have different timezone strings (e.g. GMT vs BST, EST vs EDT), DST is in effect if current matches the summer one
      if (janStr !== julStr) {
        // In Northern hemisphere, DST is usually in July. If now matches July and differs from Jan, DST is active
        return nowStr === julStr && nowStr !== janStr;
      }
      return false;
    } catch {
      return false;
    }
  }
}
