import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { CollectionService } from '../../collection';
import { AuthService } from '../../services';
import { ModalConfirmService, ModalErrorService } from '../../modals';

import { Tools } from '../tools';

@Component({
    selector: 'ui-collection-data',
    templateUrl: './collection-data.component.html',
    styles: [],
    providers: [
        CollectionService
    ]
})
export class CollectionDataComponent implements OnInit {
    public collectionName: string = null;
    public data: any[] = [];
    public editable: boolean = false;
    public fields: any[] = [];
    public schema: any = null;

    constructor(
        private coll: CollectionService,
        private authSrv: AuthService,
        private mcSrv: ModalConfirmService,
        private meSrv: ModalErrorService,
        private route: ActivatedRoute,
        private router: Router) {
    }

    public addEntry(event: any): void {
        this.router.navigateByUrl(`/ce/collections/${this.collectionName}/\$new`);
    }
    public deleteEntry(entry: any, event: any): void {
        const callback = (confirmed: boolean) => {
            if (confirmed) {
                this.coll.delete(this.collectionName, entry._id)
                    .subscribe(() => {
                        this.data = [];
                        this.loadData();
                    }, error => {
                        this.meSrv.show([
                            `<pre>${JSON.stringify(JSON.parse(error._body), null, 2)}</pre>`
                        ], `${error.status}: ${error.statusText}`);
                    });
            }
        };
        this.mcSrv.confirm([
            `You are about to delete this entry. This action can not be undone.`,
            `Are you sure?`
        ], callback, `Delete '${entry._id}'`);
    }
    public editEntry(entry: any, event: any): void {
        this.router.navigateByUrl(`/ce/collections/${this.collectionName}/${entry._id}`);
    }
    public goBack(event: any): void {
        this.router.navigateByUrl(`/ce/collections`);
    }

    ngOnInit() {
        this.route.params.subscribe((params: ParamMap) => {
            this.collectionName = params['collectionName'];
            this.loadSchema();
        });
    }

    protected loadData(): void {
        this.coll.get(this.collectionName, {}, true).subscribe(data => {
            this.data = data;
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
    protected loadSchema(): void {
        this.coll.schema(this.collectionName).subscribe(schema => {
            this.schema = schema;

            let aux: any = Tools.ParseSchemaFields(this.schema);
            this.editable = aux.editable;
            this.fields = aux.fields;

            this.loadData();
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
