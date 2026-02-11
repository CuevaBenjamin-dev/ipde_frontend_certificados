import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthEndpoint =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/refresh') ||
    req.url.includes('/auth/logout');

  const accessToken = localStorage.getItem('accessToken');

  if (accessToken && !isAuthEndpoint) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 && !isAuthEndpoint && accessToken) {
        return authService.refreshToken().pipe(
          switchMap((res) => {
            if (!res.success || !res.data) {
              throw new Error('Refresh fallido');
            }

            localStorage.setItem('accessToken', res.data);

            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${res.data}` },
            });

            return next(retryReq);
          }),
          catchError((e) => {
            localStorage.removeItem('accessToken');
            router.navigate(['/login']);
            return throwError(() => e);
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};
