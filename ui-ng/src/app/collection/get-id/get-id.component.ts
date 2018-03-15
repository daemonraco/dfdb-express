import { Component, Input, OnInit } from '@angular/core';

import { CollectionService } from '../../services/collection.service';
import { ModalErrorService } from '../../services/modal-error.service';

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
    public results: string = '';

    constructor(
        private collectionSrv: CollectionService,
        private meSrv: ModalErrorService) {
    }

    public submitQuery(event): void {
        this.error = null;
        this.results = '';

        if (this.documentId) {
            this.collectionSrv.getByIt(this.collectionName, this.documentId)
                .subscribe(data => {
                    this.results = JSON.stringify(data, null, 2);
                }, error => {
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
