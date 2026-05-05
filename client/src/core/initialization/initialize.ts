import { firstValueFrom } from 'rxjs';
import { inject } from '@angular/core';
import { AuthStateService } from '../services/auth-state-service';
import { AuthSessionService } from '../services/auth-session-service';
import { StartupService } from '../services/startup-service';

/**
 * Centralized application initialization.
 * Add any "must-have before first render" startup tasks here.
 */
export function initializeApp(): () => Promise<void> {
  return async () => {
    const authState = inject(AuthStateService);
    const authSession = inject(AuthSessionService);
    const startup = inject(StartupService);

    try {
      await firstValueFrom(authState.restoreSession());
    } catch {
      authSession.setUnauthenticated();
    } finally {
      startup.markReady();
    }
  };
}
