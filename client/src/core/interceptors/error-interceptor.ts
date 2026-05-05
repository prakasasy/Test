import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthStateService } from '../services/auth-state-service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const authState = inject(AuthStateService);
  const isAuthEndpoint =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/refresh') ||
    req.url.includes('/auth/logout');

  return next(req).pipe(
    catchError(error => {
      let returnError = error;
      if (error) {
        switch (error.status) {
          case 400:
            if (error.error.ValidationErrors) {
              const modalStateErrors = [];
              for (const key in error.error.ValidationErrors) {
                if (error.error.ValidationErrors[key]) {
                  modalStateErrors.push(error.error.ValidationErrors[key].errorMessage);
                }
              }
              returnError = modalStateErrors.flat();
            }
            else
            {
              returnError = error.error.detail;
            }
            break;
          case 401 :
            if (isAuthEndpoint) {
              returnError = error.error.detail;
              break;
            }
            
            if (!isRefreshing) {
              isRefreshing = true;
              refreshTokenSubject.next(null);
      
              return authState.refreshAccessToken().pipe(
                switchMap((newAccessToken) => {
                  isRefreshing = false;
                  refreshTokenSubject.next(newAccessToken);
      
                  const retryReq = req.clone({
                    setHeaders: {
                      Authorization: `Bearer ${newAccessToken}`
                    }
                  });
      
                  return next(retryReq);
                }),
                catchError((refreshError) => {
                  isRefreshing = false;
                  authState.handleRefreshFailed();
                  return throwError(() => refreshError);
                })
              );
            }
      
            return refreshTokenSubject.pipe(
              filter((token) => token !== null),
              take(1),
              switchMap((token) => {
                const retryReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${token!}`
                  }
                });
      
                return next(retryReq);
              })
            );
          case 403 :
            returnError = 'Forbidden';
            break;
          case 404 :
            returnError = 'Url was Not Found';
            break;
          case 500 :
            returnError = 'Internal Server Error';
            break;
          default:
            returnError = 'Internal Server Error';
            break;
        }
      }
      return throwError(() => returnError);
    })
  );
};
