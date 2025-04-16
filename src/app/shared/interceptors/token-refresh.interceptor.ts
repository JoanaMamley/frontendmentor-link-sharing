// token-refresh.interceptor.ts
import {
    HttpInterceptorFn,
    HttpRequest,
    HttpHandlerFn,
    HttpErrorResponse
  } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, of, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


export const tokenRefreshInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const excludedUrls = [
        '/api/refresh',
        '/api/login',
        '/api/logout',
        '/api/isAuthenticated',
        '/api/register',
    ];

    if (excludedUrls.some(url => req.url.includes(url))) {
        return next(req); // skip error handling logic
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
            console.log('Token expired, refreshing...');
            return authService.refreshAccessToken().pipe(
                switchMap(() => {
                    // Retry the original request after refreshing token
                    console.log('Token refreshed, retrying request...');
                    return next(req.clone());
                }),
                catchError((errorHere) => {
                    console.log(errorHere);
                    console.log('Refresh token expired, logging out...');
                    return authService.logout().pipe(
                        switchMap(() => throwError(() => new Error('Session expired'))),
                        catchError(() => {
                            console.log('Error during logout, navigating to login page...');
                            // router.navigateByUrl('/login');
                            return throwError(() => new Error('Session expired and navigation to login page triggered'));
                        })
                    );
                })
            );
        }
        return throwError(() => error);
        })
    );
};
