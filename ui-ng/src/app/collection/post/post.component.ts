import { Component, Input, OnInit } from '@angular/core';

import { CollectionService } from '../../services/collection.service';
import { ErrorModalService } from '../../services/error-modal.service';

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
    public results: string = '';

    constructor(
        private collectionSrv: CollectionService,
        private emSrv: ErrorModalService) {
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

        if (parsedData) {
            this.data = JSON.stringify(parsedData, null, 2);

            this.collectionSrv.postData(this.collectionName, parsedData)
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
            let parsedData: any = JSON.parse(this.data);
            this.data = JSON.stringify(parsedData, null, 2);
        } catch (e) { }
    }

    ngOnInit() {
    }
}
