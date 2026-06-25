import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/** Endpoints that must NOT receive an Authorization header (they run before login exists). */
const AUTH_FREE_PATHS = ['/auth/login/', '/auth/refresh/', '/accounts/register/'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const isAuthFree = AUTH_FREE_PATHS.some((path) => req.url.includes(path));

  const token = authService.getAccessToken();
  const authedReq = !isAuthFree && token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const canRetryWithRefresh = error.status === 401 && !isAuthFree && !!authService.getRefreshToken();
      if (!canRetryWithRefresh) {
        return throwError(() => error);
      }

      return authService.refreshAccessToken().pipe(
        switchMap(({ access }) => {
          const retriedReq = req.clone({ setHeaders: { Authorization: `Bearer ${access}` } });
          return next(retriedReq);
        }),
        catchError((refreshError) => {
          // Refresh token is also invalid/expired — log the user out fully.
          authService.logout();
          return throwError(() => refreshError);
        })
      );
    })
  );
};
