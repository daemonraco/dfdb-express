import { Component, Input, OnInit } from '@angular/core';

import { CollectionService } from '../../services/collection.service';
import { ModalErrorService } from '../../services/modal-error.service';

declare var DFDBConfig;

@Component({
    selector: 'ui-collection-delete',
    templateUrl: './delete.component.html',
    styles: [],
    providers: [CollectionService]
})
export class CollectionDeleteComponent implements OnInit {
    @Input('collection') public collectionName: string;

    public documentId: string = '';
    public error: any = null;
    public restUri: string = DFDBConfig.restUri;
    public results: string = '';

    constructor(
        private collectionSrv: CollectionService,
        private emSrv: ModalErrorService) {
    }

    public submitQuery(event): void {
        this.error = null;
        this.results = '';

        if (this.documentId) {
            this.collectionSrv.delete(this.collectionName, this.documentId)
                .subscribe(data => {
                    this.results = JSON.stringify(data, null, 2);
                }, error => {
                    this.error = error;
                    this.error.body = JSON.stringify(JSON.parse(this.error._body), null, 2);
                });
        } else {
            this.emSrv.show(`No valid ID was given`);
        }
    }

    ngOnInit() {
    }
}
