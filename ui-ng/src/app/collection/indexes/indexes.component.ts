import { Component,/* EventEmitter,*/ Input, OnInit/*, Output*/ } from '@angular/core';

import { CollectionService } from '../../services/collection.service';
import { ModalConfirmService } from '../../services/modal-confirm.service';
import { ModalErrorService } from '../../services/modal-error.service';

@Component({
    selector: 'ui-collection-indexes',
    templateUrl: './indexes.component.html',
    styles: [],
    providers: [CollectionService]
})
export class CollectionIndexesComponent implements OnInit {
    @Input('collection') public collectionName: string;
    // @Output('reloadCollections') public reloadCollections: EventEmitter<any> = new EventEmitter<any>();

    public indexes: any[] = [];
    public indexName: string = '';

    constructor(
        private colSrv: CollectionService,
        private mcSrv: ModalConfirmService,
        private meSrv: ModalErrorService) {
    }

    public createFieldIndex(event: any): void {
        if (this.indexName) {
            this.colSrv.createFieldIndex(this.collectionName, this.indexName)
                .subscribe(data => {
                    this.indexName = '';
                    this.loadIndexes();
                }, error => {
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
                this.colSrv.dropFieldIndex(this.collectionName, index.field)
                    .subscribe(data => {
                        this.loadIndexes();
                    }, error => {
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

    protected loadIndexes(): void {
        this.colSrv.indexes(this.collectionName).subscribe(data => {
            this.indexes = [];
            Object.keys(data).sort().forEach(key => {
                this.indexes.push(data[key]);
            });
        });
    }
}
