import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services';

declare var DFDBConfig;

@Component({
    selector: 'ui-navbar',
    templateUrl: './navbar.component.html',
    styles: []
})
export class NavbarComponent implements OnInit {
    public hasLogin: boolean = false;
    public loggedIn: boolean = false;
    public restUri: string = DFDBConfig.restUri;

    constructor(
        private authSrv: AuthService,
        private router: Router) {
    }

    public logout(): void {
        this.authSrv.logout();
        this.router.navigateByUrl('/login');
    }

    ngOnInit() {
        this.hasLogin = this.authSrv.hasLogin();
        this.loggedIn = this.authSrv.isLoggedIn();

        this.authSrv.loggedIn().subscribe(loggedIn => {
            this.loggedIn = loggedIn;
        });
    }
}
