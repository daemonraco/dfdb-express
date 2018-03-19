import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, ConnectionService, LoadingService } from '../../services';
import { ModalErrorService } from '../../modals';

@Component({
    selector: 'ui-page-main',
    templateUrl: './main.component.html',
    styles: [],
    providers: [ConnectionService]
})
export class PageMainComponent implements AfterViewChecked, OnInit {
    public name: string = '';

    public collections: any[] = [];

    constructor(
        private conn: ConnectionService,
        private authSrv: AuthService,
        private lSrv: LoadingService,
        private meSrv: ModalErrorService,
        private router: Router) {
    }

    public createCollection(event): void {
        if (this.name) {
            this.conn.createCollection(this.name)
                .subscribe(data => {
                    this.name = '';
                    this.loadCollections();
                }, error => {
                    this.meSrv.show([
                        `Error: <code>${JSON.stringify(JSON.parse(error._body), null, 2)}</code>`
                    ], `${error.status}: ${error.statusText}`);
                });
        } else {
            this.meSrv.show(`No valid name was given`);
        }
    }
    public loadCollections(): void {
        this.conn.info()
            .subscribe(data => {
                this.collections = [];
                Object.keys(data.collections)
                    .sort()
                    .forEach(key => {
                        this.collections.push(data.collections[key]);
                    });
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

    ngAfterViewChecked() {
        this.lSrv.hide();
    }
    ngOnInit() {
        this.loadCollections();

        this.lSrv.show();
    }
}
