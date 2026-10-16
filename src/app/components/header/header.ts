import { Component, inject, signal, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TempleDataService } from '../../services/temple.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent implements OnInit {
  private readonly templeService = inject(TempleDataService);
  readonly liveStatus = this.templeService.liveStatus;
  readonly isMobileMenuOpen = signal(false);
  readonly isScrolled = signal(false);

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.checkScroll();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkScroll();
  }

  private checkScroll(): void {
    if (typeof window !== 'undefined') {
      const scrollPos = window.scrollY || document.documentElement.scrollTop || 0;
      this.isScrolled.set(scrollPos > 25);
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
