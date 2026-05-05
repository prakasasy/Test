import { computed, Injectable, signal } from '@angular/core';
import { AuthStatus } from '../../types/auth';
import { CurrentUser } from '../../types/user';

@Injectable({
  providedIn: 'root',
})
export class AuthSessionService {
  readonly status = signal<AuthStatus>('unknown');
  readonly currentUser = signal<CurrentUser | null>(null);
  readonly initialized = signal(false);

  readonly isAuthenticated = computed(() => this.status() === 'authenticated');

  setAuthenticated(user: CurrentUser): void {
    this.currentUser.set(user);
    this.status.set('authenticated');
    this.initialized.set(true);
  }

  setUnauthenticated(): void {
    this.currentUser.set(null);
    this.status.set('unauthenticated');
    this.initialized.set(true);
  }

  setInitializedOnly(): void {
    this.initialized.set(true);
  }

  resetToUnknown(): void {
    this.currentUser.set(null);
    this.status.set('unknown');
    this.initialized.set(false);
  }
}
