import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CollectionService } from '../../collection';
import { AuthService, ConnectionService } from '../../services';
import { ModalErrorService } from '../../modals';

declare var DFDBConfig;

@Component({
    selector: 'ui-collections',
    templateUrl: './collections.component.html',
    styles: [],
    providers: [
        CollectionService,
        ConnectionService
    ]
})
export class CollectionsComponent implements OnInit {
    public collections: any[] = [];
    public restUri: string = DFDBConfig.restUri;
    public uiUri: string = DFDBConfig.uiUri;

    constructor(
        private coll: CollectionService,
        private conn: ConnectionService,
        private authSrv: AuthService,
        private meSrv: ModalErrorService,
        private router: Router) {
    }

    public openCollection(collection: any, event: any): void {
        this.router.navigateByUrl(`/ce/collections/${collection.name}`);
    }

    ngOnInit() {
        this.loadCollections();
    }

    protected loadCollectionSchemas(): void {
        this.collections.forEach(col => {
            this.coll.schema(col.name).subscribe(data => {
                col.hasSchema = data !== null;
            });
        });
    }
    protected loadCollections(): void {
        this.conn.info()
            .subscribe(data => {
                this.collections = [];
                Object.keys(data.collections)
                    .sort()
                    .forEach(key => {
                        let aux: any = data.collections[key];
                        aux.hasSchema = false;

                        this.collections.push(aux);
                    });

                this.loadCollectionSchemas();
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
}
