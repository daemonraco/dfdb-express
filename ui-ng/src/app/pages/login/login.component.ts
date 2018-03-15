import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

declare var DFDBConfig: any;

@Component({
    selector: 'ui-login',
    templateUrl: './login.component.html',
    styles: [],
    providers: [AuthService]
})
export class LoginComponent implements OnInit {
    public authType: string = DFDBConfig.authType;
    public password: string = '';
    public token: string = '';

    constructor(
        private router: Router,
        private authSrv: AuthService) {
    }

    public login(event): void {
        if (this.authType == 'basic') {
            this.authSrv.loginBasic(this.password)
                .subscribe((ok: boolean) => {
                    if (ok) {
                        this.router.navigateByUrl('/');
                    }
                });
        } else if (this.authType == 'custom') {
            this.authSrv.loginCustom(this.token)
                .subscribe((ok: boolean) => {
                    if (ok) {
                        this.router.navigateByUrl('/');
                    }
                });
        }
    }

    ngOnInit() {
    }
}
