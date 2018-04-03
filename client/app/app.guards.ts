import { AuthService } from './shared/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, NavigationExtras } from '@angular/router';

@Injectable()
export class DashboardCanActivateGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): boolean {
        if(this.authService.isUserLoggedIn()) {
            return true;
        }
        else {
            let navigationExtras: NavigationExtras = {
                queryParams: { 'errorMessage': 'You have to login first' }
            };
            this.router.navigate(['/login'], navigationExtras);
            return false;
        }
    }
}