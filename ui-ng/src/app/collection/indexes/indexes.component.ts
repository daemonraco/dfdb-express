import { Component, Input, OnInit } from '@angular/core';

import { CollectionService } from '..';
import { LoadingService } from '../../services';
import { ModalConfirmService, ModalErrorService } from '../../modals';

@Component({
    selector: 'ui-collection-indexes',
    templateUrl: './indexes.component.html',
    styles: [],
    providers: [CollectionService]
})
export class CollectionIndexesComponent implements OnInit {
    @Input('collection') public collectionName: string;

    public indexes: any[] = [];
    public indexName: string = '';

    constructor(
        private colSrv: CollectionService,
        private lSrv: LoadingService,
        private mcSrv: ModalConfirmService,
        private meSrv: ModalErrorService) {
    }

    public createFieldIndex(event: any): void {
        if (this.indexName) {
            this.lSrv.show();

            this.colSrv.createFieldIndex(this.collectionName, this.indexName)
                .subscribe(data => {
                    this.indexName = '';
                    this.loadIndexes(() => {
                        this.lSrv.hide();
                    });
                }, error => {
                    this.lSrv.hide();
                    this.meSrv.show([
                        `Error: <code>${JSON.stringify(JSON.parse(error._body), null, 2)}</code>`
                    ], `${error.status}: ${error.statusText}`);
                });
        } else {
            this.meSrv.show(`No valid name was given`);
        }
    }
    public dropFieldIndex(index: any, event: any): void {
        const callback = (confirmed: boolean) => {
            if (confirmed) {
                this.lSrv.show();

                this.colSrv.dropFieldIndex(this.collectionName, index.field)
                    .subscribe(data => {
                        this.loadIndexes(() => {
                            this.lSrv.hide();
                        });
                    }, error => {
                        this.lSrv.hide();
                        this.meSrv.show([
                            `Error: <code>${JSON.stringify(JSON.parse(error._body), null, 2)}</code>`
                        ], `${error.status}: ${error.statusText}`);
                    });
            }
        };
        this.mcSrv.confirm([
            `You are about to drop index '${index.name}' from collection '${this.collectionName}'. This action can not be undone.`,
            `Are you sure?`
        ], callback, 'Drop field index');
    }

    ngOnInit() {
        /** @todo fix this ugly timeout. */
        setTimeout(() => this.loadIndexes(), 1000);
    }

    protected loadIndexes(done: () => void = null): void {
        if (!done) {
            done = () => { };
        }

        this.colSrv.indexes(this.collectionName).subscribe(data => {
            this.indexes = [];
            Object.keys(data).sort().forEach(key => {
                this.indexes.push(data[key]);
            });

            done();
        });
    }
}
