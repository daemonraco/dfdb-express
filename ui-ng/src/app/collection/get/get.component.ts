import { Component, Input, OnInit } from '@angular/core';

import { CollectionService } from '../collection.service';
import { ModalErrorService } from '../../modals';

declare var DFDBConfig;

@Component({
    selector: 'ui-collection-get',
    templateUrl: './get.component.html',
    styles: [],
    providers: [CollectionService]
})
export class CollectionGetComponent implements OnInit {
    @Input('collection') public collectionName: string;

    public error: any = '';
    public filter: string = '{}';
    public restUri: string = DFDBConfig.restUri;
    public results: string = '';
    public simple: boolean = true;

    constructor(
        private collectionSrv: CollectionService,
        private meSrv: ModalErrorService) {
    }

    public submitQuery(event): void {
        this.error = null;
        this.results = '';

        let parsedFilter: any = null;
        try { parsedFilter = JSON.parse(this.filter); } catch (e) {
            this.meSrv.show([
                `Given filters JSON seems to be invalid.`,
                `${e}`
            ]);
        }

        if (parsedFilter) {
            this.filter = JSON.stringify(parsedFilter, null, 2);

            this.collectionSrv.get(this.collectionName, this.filter, this.simple)
                .subscribe(data => {
                    this.results = JSON.stringify(data, null, 2);
                }, error => {
                    this.error = error;
                    this.error.body = JSON.stringify(JSON.parse(this.error._body), null, 2);
                });
        }
    }
    public tidy(event): void {
        try {
            let parsedFilter: any = JSON.parse(this.filter);
            this.filter = JSON.stringify(parsedFilter, null, 2);
        } catch (e) { }
    }

    ngOnInit() {
    }
}

