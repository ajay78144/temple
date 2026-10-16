import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TempleDataService } from '../../services/temple.service';
import { TempleService } from '../../models/temple.models';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './service-detail.html',
  styleUrl: './service-detail.css'
})
export class ServiceDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly templeService = inject(TempleDataService);

  readonly service = signal<TempleService | undefined>(undefined);
  readonly allServices = this.templeService.services;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        const found = this.templeService.getServiceBySlug(slug);
        this.service.set(found);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}
