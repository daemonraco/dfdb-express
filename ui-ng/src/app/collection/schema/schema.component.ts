import { Component, Input, OnInit } from '@angular/core';

import { CollectionService } from '..';
import { ModalErrorService } from '../../modals';

declare var DFDBConfig;

@Component({
    selector: 'ui-collection-schema',
    templateUrl: './schema.component.html',
    styles: [],
    providers: [CollectionService]
})
export class CollectionSchemaComponent implements OnInit {
    @Input('collection') public collectionName: string;

    public error: any = '';
    public results: string = '';
    public restUri: string = DFDBConfig.restUri;
    public schema: string = '';

    constructor(
        private collectionSrv: CollectionService,
        private meSrv: ModalErrorService) {
    }

    public submitQuery(event): void {
        this.error = null;
        this.results = '';

        this.schema = this.schema.trim();

        let parsedSchema: any = null;
        let parsedSchemaFailed: boolean = true;
        if (this.schema) {
            try {
                parsedSchema = JSON.parse(this.schema.trim());
                parsedSchemaFailed = false;
            } catch (e) {
                this.meSrv.show([
                    `Given schema JSON seems to be invalid.`,
                    `${e}`
                ]);
            }
        } else {
            parsedSchemaFailed = false;
        }

        if (!parsedSchemaFailed) {
            this.tidy(null);

            this.collectionSrv.setSchema(this.collectionName, parsedSchema)
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
            this.schema = this.schema.trim();
            if (this.schema) {
                let parsedSchema: any = JSON.parse(this.schema);
                this.schema = JSON.stringify(parsedSchema, null, 2);
            }
        } catch (e) { }
    }

    ngOnInit() {
        this.loadSchema();
    }

    protected loadSchema() {
        this.collectionSrv.schema(this.collectionName)
            .subscribe(data => {
                this.schema = data ? JSON.stringify(data, null, 2) : '';
            });
    }
}
