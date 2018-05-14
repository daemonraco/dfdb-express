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
    public filter: string = '{}';
    public partial: boolean = true;
    public restUri: string = DFDBConfig.restUri;
    public results: string = '';
    public single: boolean = true;

    constructor(
        private collectionSrv: CollectionService,
        private lSrv: LoadingService,
        private meSrv: ModalErrorService) {
    }

    public submitQuery(event): void {
        this.error = null;
        this.results = '';

        let parsedData: any = null;
        try { parsedData = JSON.parse(this.data); } catch (e) {
            this.meSrv.show([
                `Given data JSON seems to be invalid.`,
                `${e}`
            ]);
        }
        if (parsedData && !this.documentId) {
            this.meSrv.show(`No valid ID was given`);
        }

        if (this.single) {
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
        } else if (parsedData) {
            let parsedFilter: any = null;
            try { parsedFilter = JSON.parse(this.filter); } catch (e) {
                this.meSrv.show([
                    `Given filters JSON seems to be invalid.`,
                    `${e}`
                ]);
            }

            if (parsedFilter) {
                this.data = JSON.stringify(parsedData, null, 2);
                this.filter = JSON.stringify(parsedFilter, null, 2);
                this.lSrv.show();

                this.collectionSrv.putMany(this.collectionName, parsedFilter, parsedData)
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
    }
    public tidy(event): void {
        try {
            let aux: any = JSON.parse(this.data);
            this.data = JSON.stringify(aux, null, 2);
        } catch (e) { }

        try {
            let aux: any = JSON.parse(this.filter);
            this.filter = JSON.stringify(aux, null, 2);
        } catch (e) { }
    }

    ngOnInit() {
    }
}
