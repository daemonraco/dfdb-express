import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, LoadingService, ConnectionService } from '../../services';
import { ModalErrorService } from '../../modals';

@Component({
    selector: 'ui-initializer',
    templateUrl: './initializer.component.html',
    styles: [],
    providers: [ConnectionService]
})
export class PageInitializerComponent implements OnInit {
    public data: string = '';
    public dataReset: string = '';

    constructor(
        private authSrv: AuthService,
        private connSrv: ConnectionService,
        private emSrv: ModalErrorService,
        private lSrv: LoadingService,
        private meSrv: ModalErrorService,
        private router: Router) {
    }

    public reapply(event: any): void {
        this.lSrv.show();

        this.connSrv.reinitialize()
            .subscribe(data => {
                this.lSrv.hide();
                this.loadInitializer();
            }, error => {
                this.lSrv.hide();
                JSON.stringify(JSON.parse(error._body), null, 2);
            });
    }
    public reset(event: any): void {
        this.data = this.dataReset;
        this.tidy(null);
    }
    public sendData(event: any): void {
        if (this.tidy(null)) {
            this.lSrv.show();
            const parsedData: any = this.data.trim() ? JSON.parse(this.data) : null;

            this.connSrv.setInitializer(parsedData)
                .subscribe(data => {
                    this.lSrv.hide();
                    this.loadInitializer();
                }, error => {
                    this.lSrv.hide();
                    JSON.stringify(JSON.parse(error._body), null, 2);
                });
        } else {
            this.meSrv.show([
                `Given data JSON seems to be invalid.`
            ]);
        }
    }
    public tidy(event: any): boolean {
        let valid: boolean = false;

        this.data = this.data.trim();

        if (this.data === '') {
            valid = true;
        } else {
            try {
                let parsedDataStr: any = JSON.parse(this.data);
                this.data = JSON.stringify(parsedDataStr, null, 2);

                if (this.data === 'null') {
                    this.data = '';
                }

                valid = true;
            } catch (e) { }
        }

        return valid;
    }

    ngOnInit() {
        this.lSrv.show();
        this.loadInitializer();
    }

    protected loadInitializer(): void {
        this.connSrv.info()
            .subscribe(data => {
                this.data = this.dataReset = JSON.stringify(data.initializer);
                this.tidy(null);
                this.lSrv.hide();
            }, error => {
                this.lSrv.hide();
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
}
