import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.html',
  styleUrl: './loader.css'
})
export class LoaderComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);

  // Initial Fullscreen Divine Splash Loader (Lightweight & Smooth)
  readonly isInitialLoading = signal(true);
  readonly isFadingOut = signal(false);

  // Top Page Route Transition Bar
  readonly isNavigating = signal(false);

  private timeoutIds: any[] = [];

  ngOnInit(): void {
    this.runInitialSplash();
    this.listenToRouteChanges();
  }

  private runInitialSplash(): void {
    // Lightweight smooth entrance: displays briefly (280ms) then smoothly fades out without blocking
    const t1 = setTimeout(() => {
      this.isFadingOut.set(true);
      const t2 = setTimeout(() => {
        this.isInitialLoading.set(false);
      }, 350);
      this.timeoutIds.push(t2);
    }, 280);
    this.timeoutIds.push(t1);
  }

  private listenToRouteChanges(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isNavigating.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        const t = setTimeout(() => {
          this.isNavigating.set(false);
        }, 220);
        this.timeoutIds.push(t);
      }
    });
  }

  ngOnDestroy(): void {
    this.timeoutIds.forEach(id => clearTimeout(id));
  }
}
