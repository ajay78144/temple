import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TempleDataService } from '../../services/temple.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './services.html',
  styleUrl: './services.css'
})
export class ServicesComponent {
  private readonly templeService = inject(TempleDataService);
  readonly services = this.templeService.services;
}
