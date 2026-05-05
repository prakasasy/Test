import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSessionService } from '../services/auth-session-service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authSession = inject(AuthSessionService);
  const router = inject(Router);

  if (authSession.status() === 'authenticated') {
    return router.createUrlTree(['']);
  }
  
  return true;
};
