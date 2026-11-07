import { Component, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { MobileBottomBarComponent } from './components/mobile-bottom-bar/mobile-bottom-bar';
import { LoaderComponent } from './components/loader/loader';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, MobileBottomBarComponent, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit, OnDestroy {
  title = 'Sakoon Temple';

  private revealObserver: IntersectionObserver | null = null;
  private routerSub: any;

  constructor(private router: Router, private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.initRevealObserver();
    // Re-run observer after each route navigation (new page elements)
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        // Small delay to allow new page DOM to render
        setTimeout(() => this.observeRevealElements(), 120);
      });
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
    this.routerSub?.unsubscribe();
  }

  private initRevealObserver(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    this.ngZone.runOutsideAngular(() => {
      this.revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              this.revealObserver?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      this.observeRevealElements();
    });
  }

  private observeRevealElements(): void {
    if (!this.revealObserver) return;
    document.querySelectorAll('[data-reveal]:not(.revealed)').forEach(el => {
      this.revealObserver!.observe(el);
    });
  }
}
