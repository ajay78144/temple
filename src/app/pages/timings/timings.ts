import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TempleDataService } from '../../services/temple.service';

@Component({
  selector: 'app-timings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './timings.html',
  styleUrl: './timings.css'
})
export class TimingsComponent {
  private readonly templeService = inject(TempleDataService);
  readonly liveStatus = this.templeService.liveStatus;
  readonly timingSlots = this.templeService.timingSlots;
}
