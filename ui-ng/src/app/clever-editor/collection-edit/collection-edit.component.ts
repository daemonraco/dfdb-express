import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { CollectionService } from '../../collection';
import { AuthService } from '../../services';
import { ModalConfirmService, ModalErrorService } from '../../modals';

import { Tools } from '../tools';

@Component({
    selector: 'ui-collection-edit',
    templateUrl: './collection-edit.component.html',
    styles: [],
    providers: [
        CollectionService
    ]
})
export class CollectionEditComponent implements OnInit {
    public collectionName: string = '';
    public data: any = {};
    public dataReset: any = {};
    public editable: boolean = false;
    public fields: any[] = [];
    public id: string = '';
    public isNew: boolean = false;
    public saving: boolean = false;
    public schema: any = null;

    constructor(
        private coll: CollectionService,
        private authSrv: AuthService,
        private mcSrv: ModalConfirmService,
        private meSrv: ModalErrorService,
        private route: ActivatedRoute,
        private router: Router) {
    }

    public goBack(event: any): void {
        this.router.navigateByUrl(`/ce/collections/${this.collectionName}`);
    }
    public reset(event: any): void {
        this.data = JSON.parse(JSON.stringify(this.dataReset));
    }
    public sendEntry(event: any): void {
        const wrong: any = error => {
            if (error.status == 403) {
                this.authSrv.logout();
                this.router.navigateByUrl('/login');
            } else {
                this.meSrv.show([
                    `Error: <code>${JSON.stringify(JSON.parse(error._body), null, 2)}</code>`
                ], `${error.status}: ${error.statusText}`);
            }
        };

        if (this.isNew) {
            this.coll.postData(this.collectionName, this.data)
                .subscribe(data => {
                    this.router.navigateByUrl(`/ce/collections/${this.collectionName}/${data._id}`);
                }, wrong);
        } else {
            this.coll.putData(this.collectionName, this.id, this.data, true)
                .subscribe(data => {
                    this.data = data;
                    this.dataReset = JSON.parse(JSON.stringify(this.data));
                }, wrong);
        }
    }

    ngOnInit() {
        this.route.params.subscribe((params: ParamMap) => {
            this.collectionName = params['collectionName'];
            this.id = params['id'];

            this.isNew = this.id === '$new';

            this.loadSchema();
        });
    }

    protected loadData(): void {
        this.coll.getById(this.collectionName, this.id).subscribe(data => {
            this.data = data;
            this.dataReset = JSON.parse(JSON.stringify(this.data));
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
