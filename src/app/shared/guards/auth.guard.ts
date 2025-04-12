import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { catchError, map, Observable, of } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        return this.authService.isAuthenticated().pipe(
            map(isAuth => {
            return isAuth.message === 'User is authenticated' ? true : this.router.createUrlTree(['/login']);
            }),
            catchError(error => {
            if (error instanceof HttpErrorResponse && error.error?.message === 'User is not authenticated') {
                return of(this.router.createUrlTree(['/login']));
            }
            throw error;
            })
        );
    }

}