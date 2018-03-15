import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ModalErrorService } from '../../services/modal-error.service';

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
        private meSrv: ModalErrorService,
        private authSrv: AuthService) {
    }

    public goHome(event) {
        this.router.navigateByUrl('/');
    }
    public login(event): void {
        if (this.authType == 'basic') {
            this.authSrv.loginBasic(this.password)
                .subscribe((ok: boolean) => {
                    if (ok) {
                        this.router.navigateByUrl('/');
                    } else {
                        this.meSrv.show(`Given password is not accepted.`);
                    }
                });
        } else if (this.authType == 'custom') {
            this.authSrv.loginCustom(this.token)
                .subscribe((ok: boolean) => {
                    if (ok) {
                        this.router.navigateByUrl('/');
                    } else {
                        this.meSrv.show(`Given token is not accepted.`);
                    }
                });
        }
    }

    ngOnInit() {
        this.token = this.authSrv.token();
    }
}
