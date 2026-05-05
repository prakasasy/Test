import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalLoader, InitialSplash } from '../shared';
import { StartupService } from '../core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlobalLoader, InitialSplash],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnDestroy {
  private readonly startup = inject(StartupService);
  private readonly minSplashDuration = 1000;
  private readonly splashFadeDuration = 400;
  private minTimer: ReturnType<typeof setTimeout> | null = null;
  private fadeTimer: ReturnType<typeof setTimeout> | null = null;
  private prebootTimer: ReturnType<typeof setTimeout> | null = null;
  private minElapsed = signal(false);

  /** Whether the initial splash component is rendered. */
  readonly showInitialSplash = signal(true);

  /** Whether the splash should play its fade-out transition. */
  readonly initialSplashHiding = signal(false);

  constructor() {
    // Remove the pre-Angular splash once Angular has bootstrapped.
    const preboot = document.getElementById('preboot-splash');
    if (preboot) {
      preboot.classList.add('preboot-splash--hiding');
      preboot.classList.add('splash--hiding');
      this.prebootTimer = setTimeout(() => {
        preboot.remove();
        this.prebootTimer = null;
      }, this.splashFadeDuration);
    }

    // Minimum visible duration.
    this.minTimer = setTimeout(() => {
      this.minTimer = null;
      this.minElapsed.set(true);
    }, this.minSplashDuration);

    // Hide only when both:
    // - startup tasks finished (auth/config/essential data)
    // - minimum duration elapsed (prevents flash)
    effect(() => {
      if (!this.showInitialSplash()) return;
      if (this.initialSplashHiding()) return;
      if (!this.minElapsed()) return;
      if (!this.startup.ready()) return;

      this.initialSplashHiding.set(true);
      this.fadeTimer = setTimeout(() => {
        this.showInitialSplash.set(false);
        this.fadeTimer = null;
      }, this.splashFadeDuration);
    });
  }

  ngOnDestroy(): void {
    if (this.minTimer) clearTimeout(this.minTimer);
    if (this.fadeTimer) clearTimeout(this.fadeTimer);
    if (this.prebootTimer) clearTimeout(this.prebootTimer);
  }
}
