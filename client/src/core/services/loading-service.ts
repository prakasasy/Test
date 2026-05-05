import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  /**
   * Wait this long before showing the overlay so very fast requests never flash it.
   */
  private static readonly SHOW_DELAY_MS = 200;

  private count = 0;
  private showDelayId: ReturnType<typeof setTimeout> | null = null;

  isLoading = signal(false);

  start() {
    if (++this.count === 1) {
      this.clearPendingShow();
      this.showDelayId = setTimeout(() => {
        this.showDelayId = null;
        if (this.count > 0) {
          this.isLoading.set(true);
        }
      }, LoadingService.SHOW_DELAY_MS);
    }
  }

  stop() {
    if (this.count > 0 && --this.count === 0) {
      this.clearPendingShow();
      this.isLoading.set(false);
    }
  }

  reset() {
    this.count = 0;
    this.clearPendingShow();
    this.isLoading.set(false);
  }

  private clearPendingShow() {
    if (this.showDelayId !== null) {
      clearTimeout(this.showDelayId);
      this.showDelayId = null;
    }
  }
}
