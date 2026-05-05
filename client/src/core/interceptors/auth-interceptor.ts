import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStateService } from '../services/auth-state-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authState = inject(AuthStateService);

  const accessToken = authState.getAccessToken();

  let authReq = req;

  if (accessToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  return next(authReq);
};
