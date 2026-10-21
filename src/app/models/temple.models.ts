export interface TempleService {
  id: string;
  slug: string;
  title: string;
  hindiTitle: string;
  subtitle: string;
  category: 'astrology' | 'havan' | 'shradh' | 'celebration';
  image: string;
  shortDesc: string;
  fullDesc: string;
  scripturalRef: string;
  significance: string[];
  vidhiSteps: { step: number; title: string; desc: string }[];
  samagriIncluded: string[];
  devoteeRequirements: string[];
  duration: string;
  dakshinaSuggested: string;
  idealMuhurat: string;
  icon: string;
  badge: string;
}

export interface TempleTimingSlot {
  name: string;
  hindiName: string;
  timeRange: string;
  startHour: number; // 24-hr format
  startMin: number;
  endHour: number;
  endMin: number;
  type: 'darshan' | 'aarti' | 'vishram';
  description: string;
}

export interface LiveTempleStatus {
  isOpen: boolean;
  statusText: string;
  statusBadge: string;
  currentTimeStr: string; // Haridwar Sanctum Time (IST)
  currentDateStr: string; // Haridwar Date (IST)
  nextEvent: string;
  nextEventTime: string; // Haridwar IST
  // International devotee support
  countryTimeStr?: string;
  countryDateStr?: string;
  countryFlag?: string;
  countryName?: string;
  countryCode?: string;
  countryTzName?: string;
  timeDiffText?: string;
  isDstActive?: boolean;
  nextEventLocalTime?: string;
}

export interface PanchangFestival {
  name: string;
  hindiName: string;
  type: 'major' | 'vrat' | 'tithi';
  color: string;
  icon: string;
  significance: string;
}

export interface PanchangDay {
  dateObj: Date;
  dayNumber: number;
  monthIndex: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  
  // Desi Hindu Panchang Elements
  vikramSamvat: number;
  hinduMonth: string;
  hinduMonthHindi: string;
  paksha: 'Shukla' | 'Krishna';
  pakshaHindi: string;
  tithiNumber: number;
  tithiName: string;
  tithiHindi: string;
  nakshatra: string;
  nakshatraHindi: string;
  yoga: string;
  karana: string;
  
  // Important Fasts and Festivals
  isPurnima: boolean;
  isAmavasya: boolean;
  isEkadashi: boolean;
  isPradosh: boolean;
  isSankranti: boolean;
  festivals: PanchangFestival[];
  
  // Muhurat & Kaal
  sunrise: string;
  sunset: string;
  abhijitMuhurat: string;
  rahuKaal: string;
  vratAdvice: string;
}

export interface BookingSlot {
  id: string;
  time: string;
  period: 'Morning' | 'Afternoon' | 'Evening';
  available: boolean;
  seatsLeft: number;
}

export interface BookingRequest {
  id?: string;
  serviceId: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  devoteeName: string;
  phone: string;
  email: string;
  city?: string;
  gotra?: string;
  rashi?: string;
  attendanceMode?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  priestName?: string;
  priestPreference?: string;
  specialSankalpa?: string;
  attendeesCount: number;
  bookingRef?: string;
  createdAt?: string;
}
