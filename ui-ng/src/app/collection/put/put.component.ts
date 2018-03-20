import { Component, Input, OnInit } from '@angular/core';

import { CollectionService } from '..';
import { LoadingService } from '../../services';
import { ModalErrorService } from '../../modals';

declare var DFDBConfig;

@Component({
    selector: 'ui-collection-put',
    templateUrl: './put.component.html',
    styles: [],
    providers: [CollectionService]
})
export class CollectionPutComponent implements OnInit {
    @Input('collection') public collectionName: string;

    public data: string = '{}';
    public documentId: string = '';
    public error: any = '';
    public restUri: string = DFDBConfig.restUri;
    public results: string = '';
    public partial: boolean = true;

    constructor(
        private collectionSrv: CollectionService,
        private lSrv: LoadingService,
        private emSrv: ModalErrorService) {
    }

    public submitQuery(event): void {
        this.error = null;
        this.results = '';

        let parsedData: any = null;
        try { parsedData = JSON.parse(this.data); } catch (e) {
            this.emSrv.show([
                `Given data JSON seems to be invalid.`,
                `${e}`
            ]);
        }
        if (parsedData && !this.documentId) {
            this.emSrv.show(`No valid ID was given`);
        }

        if (parsedData && this.documentId) {
            this.data = JSON.stringify(parsedData, null, 2);
            this.lSrv.show();

            this.collectionSrv.putData(this.collectionName, this.documentId, parsedData, this.partial)
                .subscribe(data => {
                    this.results = JSON.stringify(data, null, 2);
                    this.lSrv.hide();
                }, error => {
                    this.lSrv.hide();
                    this.error = error;
                    this.error.body = JSON.stringify(JSON.parse(this.error._body), null, 2);
                });
        }
    }
    public tidy(event): void {
        try {
            let parsedFilter: any = JSON.parse(this.data);
            this.data = JSON.stringify(parsedFilter, null, 2);
        } catch (e) { }
    }

    ngOnInit() {
    }
}
