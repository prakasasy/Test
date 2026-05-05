import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSessionService } from '../services/auth-session-service';

export const authGuard: CanActivateFn = (route, state) => {
  const authSession = inject(AuthSessionService);
  const router = inject(Router);

  const status = authSession.status();

  if (status === 'authenticated') {
    return true;
  }

  return router.createUrlTree(['/auth/login']);
};
