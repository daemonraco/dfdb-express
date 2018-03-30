import { Component, Input, OnInit } from '@angular/core';

import { CollectionService } from '..';
import { LoadingService } from '../../services';
import { ModalErrorService } from '../../modals';

declare var DFDBConfig;

@Component({
    selector: 'ui-collection-post',
    templateUrl: './post.component.html',
    styles: [],
    providers: [CollectionService]
})
export class CollectionPostComponent implements OnInit {
    @Input('collection') public collectionName: string;

    public data: string = '';
    public error: any = '';
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

        let parsedData: any = null;
        try { parsedData = JSON.parse(this.data); } catch (e) {
            this.meSrv.show([
                `Given data JSON seems to be invalid.`,
                `${e}`
            ]);
        }

        if (parsedData) {
            this.data = JSON.stringify(parsedData, null, 2);
            this.lSrv.show();

            this.collectionSrv.postData(this.collectionName, parsedData)
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
            let parsedData: any = JSON.parse(this.data);
            this.data = JSON.stringify(parsedData, null, 2);
        } catch (e) { }
    }

    ngOnInit() {
    }
}
