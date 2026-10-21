import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TempleDataService } from '../../services/temple.service';
import { CountryTimezoneService } from '../../services/country-timezone.service';

@Component({
  selector: 'app-timings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './timings.html',
  styleUrl: './timings.css'
})
export class TimingsComponent {
  private readonly templeService = inject(TempleDataService);
  readonly countryTzService = inject(CountryTimezoneService);

  readonly liveStatus = this.templeService.liveStatus;
  readonly timingSlots = this.templeService.timingSlots;
  readonly selectedCountry = this.countryTzService.selectedCountry;
  readonly allCountries = this.countryTzService.allCountries;

  setCountry(countryCode: string): void {
    this.countryTzService.setCountry(countryCode);
  }

  getSlotLocalTime(startHour: number, startMin: number, endHour: number, endMin: number): {
    localTimeStr: string;
    dayOffsetNote: string;
    isDifferentFromIst: boolean;
  } {
    const country = this.selectedCountry();
    if (country.code === 'IN') {
      return {
        localTimeStr: '',
        dayOffsetNote: '',
        isDifferentFromIst: false
      };
    }

    const startLocal = this.countryTzService.convertIstTimeToCountry(startHour, startMin);
    const endLocal = this.countryTzService.convertIstTimeToCountry(endHour, endMin);

    return {
      localTimeStr: `${startLocal.localTimeStr} – ${endLocal.localTimeStr} (${country.timeZoneName})`,
      dayOffsetNote: startLocal.dayOffsetNote !== 'Same Day' ? `[${startLocal.dayOffsetNote}]` : '',
      isDifferentFromIst: true
    };
  }
}
