export interface CountryConfig {
  code: string;
  name: string;
  hindiName?: string;
  flag: string;
  timeZone: string;
  timeZoneName: string;
  phoneCode: string;
  currencySymbol: string;
  currencyCode: string;
  currencyRateFromInr: number; // For international devotee dakshina estimates
  isDstSupported: boolean;
  region: 'Asia' | 'North America' | 'Europe' | 'Middle East' | 'Oceania' | 'Africa';
}

export interface ConvertedTimingSlot {
  name: string;
  hindiName: string;
  istTimeRange: string;
  localTimeRange: string;
  dayOffsetNote?: string; // e.g. "Previous Evening", "Same Day", "Next Morning"
  type: 'darshan' | 'aarti' | 'vishram';
  description: string;
}

export interface InternationalLiveStatus {
  templeIstTimeStr: string;
  templeIstDateStr: string;
  countryTimeStr: string;
  countryDateStr: string;
  countryTzAbbr: string;
  offsetHoursDiff: number;
  offsetDescription: string;
  isDstActive: boolean;
  isOpen: boolean;
  statusText: string;
  nextEvent: string;
  nextEventIstTime: string;
  nextEventLocalTime: string;
}
