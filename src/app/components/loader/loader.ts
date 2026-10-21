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

  // Initial Fullscreen Divine Splash Loader
  readonly isInitialLoading = signal(true);
  readonly initialProgress = signal(0);
  readonly isFadingOut = signal(false);

  // Top Page Route Transition Bar
  readonly isNavigating = signal(false);

  private intervalId?: any;

  ngOnInit(): void {
    this.runInitialSplash();
    this.listenToRouteChanges();
  }

  private runInitialSplash(): void {
    let progress = 10;
    this.initialProgress.set(progress);

    this.intervalId = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 10;
      if (progress >= 100) {
        progress = 100;
        this.initialProgress.set(100);
        clearInterval(this.intervalId);

        // Smooth fade out delay
        setTimeout(() => {
          this.isFadingOut.set(true);
          setTimeout(() => {
            this.isInitialLoading.set(false);
          }, 650);
        }, 300);
      } else {
        this.initialProgress.set(progress);
      }
    }, 85);
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
        setTimeout(() => {
          this.isNavigating.set(false);
        }, 300);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
