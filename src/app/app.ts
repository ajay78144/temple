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
    // Instant Scroll-to-Top on every route change & re-run reveal observer
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        if (typeof window !== 'undefined') {
          // Immediately reset scroll to top (overcoming any smooth-scroll delays on route transition)
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }

        // Snap reveal elements in new page immediately and after render
        this.observeRevealElements();
        setTimeout(() => this.observeRevealElements(), 80);
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
