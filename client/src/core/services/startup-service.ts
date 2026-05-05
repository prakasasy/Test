import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StartupService {
  /** True once all app startup tasks are complete. */
  readonly ready = signal(false);

  markReady() {
    this.ready.set(true);
  }
}

