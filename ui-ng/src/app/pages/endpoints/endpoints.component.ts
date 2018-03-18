import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, ConnectionService } from '../../services';
import { ModalErrorService, ModalMessageService } from '../../modals';

@Component({
    selector: 'ui-page-endpoints',
    templateUrl: './endpoints.component.html',
    styles: [],
    providers: [ConnectionService]
})
export class PageEndpointsComponent implements OnInit {
    public endpoints: any[] = [];

    constructor(
        private conn: ConnectionService,
        private authSrv: AuthService,
        private meSrv: ModalErrorService,
        private mmSrv: ModalMessageService,
        private router: Router) {
    }

    public showExample(endpoint: any, event: any): void {
        this.mmSrv.show([
            endpoint.examples
        ], `Examples`, true);
    }
    public loadInformation(): void {
        this.conn.info({ fullDocs: true })
            .subscribe(data => {
                this.endpoints = data.endpoints;
            }, error => {
                if (error.status == 403) {
                    this.authSrv.logout();
                    this.router.navigateByUrl('/login');
                } else {
                    this.meSrv.show([
                        `Error: <code>${JSON.stringify(JSON.parse(error._body), null, 2)}</code>`
                    ], `${error.status}: ${error.statusText}`);
                }
            });
    }

    ngOnInit() {
        this.loadInformation();
    }
}
