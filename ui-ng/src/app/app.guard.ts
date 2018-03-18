import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';

import { AuthService } from './services/auth.service';

declare var DFDBConfig: any;

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authSrv: AuthService) {
    }

    canActivate() {
        let isAuthorized: boolean = false;

        if (this.authSrv.hasLogin()) {
            if (this.authSrv.token()) {
                isAuthorized = true;
            }
        } else {
            isAuthorized = true;
        }

        if (!isAuthorized) {
            console.error('Redirecting to login');
            this.router.navigateByUrl('/login');
        }

        return isAuthorized;
    }
}