import { Component, OnInit } from '@angular/core';

import { ConnectionService } from '../services/connection.service';
import { ModalErrorService } from '../services/modal-error.service';

@Component({
    selector: 'ui-main-page',
    templateUrl: './main-page.component.html',
    styles: [],
    providers: [ConnectionService]
})
export class MainPageComponent implements OnInit {
    public name: string = '';

    public collections: any[] = [];

    constructor(
        private conn: ConnectionService,
        private emSrv: ModalErrorService) {
    }

    public createCollection(event): void {
        this.conn.createCollection(this.name)
            .subscribe(data => {
                this.loadCollections();
            }, error => {
                this.emSrv.show([
                    `Given filters JSON seems to be invalid.`,
                    `Error ${JSON.stringify(JSON.parse(error._body), null, 2)}`
                ], `${error.status}: ${error.statusText}`);
            });
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
            });
    }

    ngOnInit() {
        this.loadCollections();
    }
}
