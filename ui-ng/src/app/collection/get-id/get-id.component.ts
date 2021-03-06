import { Component, Input, OnInit } from '@angular/core';

import { CollectionService } from '..';
import { LoadingService } from '../../services';
import { ModalErrorService } from '../../modals';

declare var DFDBConfig;

@Component({
    selector: 'ui-collection-get-id',
    templateUrl: './get-id.component.html',
    styles: [],
    providers: [CollectionService]
})
export class CollectionGetIdComponent implements OnInit {
    @Input('collection') public collectionName: string;

    public documentId: string = '';
    public error: any = null;
    public restUri: string = DFDBConfig.restUri;
    public results: string = '';

    constructor(
        private collectionSrv: CollectionService,
        private lSrv: LoadingService,
        private meSrv: ModalErrorService) {
    }

    public submitQuery(event): void {
        this.error = null;
        this.results = '';

        if (this.documentId) {
            this.lSrv.show();

            this.collectionSrv.getById(this.collectionName, this.documentId)
                .subscribe(data => {
                    this.results = JSON.stringify(data, null, 2);
                    this.lSrv.hide();
                }, error => {
                    this.lSrv.hide();
                    this.error = error;
                    this.error.body = JSON.stringify(JSON.parse(this.error._body), null, 2);
                });
        } else {
            this.meSrv.show(`No valid ID was given`);
        }
    }

    ngOnInit() {
    }
}
