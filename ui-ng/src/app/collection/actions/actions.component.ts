import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ConnectionService } from '../../services/connection.service';
import { ModalConfirmService } from '../../services/modal-confirm.service';
import { ModalErrorService } from '../../services/modal-error.service';

@Component({
    selector: 'ui-collection-actions',
    templateUrl: './actions.component.html',
    styles: []
})
export class CollectionActionsComponent implements OnInit {
    @Input('collection') public collectionName: string;
    @Output('reloadCollections') public reloadCollections: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private connSrv: ConnectionService,
        private mcSrv: ModalConfirmService,
        private meSrv: ModalErrorService) {
    }

    public dropCollection($event): void {
        const callback = (confirmed: boolean) => {
            if (confirmed) {
                this.connSrv.dropCollection(this.collectionName)
                    .subscribe(data => {
                        this.reloadCollections.emit(null);
                    }, error => {
                        this.meSrv.show([
                            `<pre>${JSON.stringify(JSON.parse(error._body), null, 2)}</pre>`
                        ], `${error.status}: ${error.statusText}`);
                    });
            }
        };
        this.mcSrv.confirm([
            `You are about to drop collection '${this.collectionName}'. This action can not be undone.`,
            `Are you sure?`
        ], callback, 'Drop collection');
    }
    public truncateCollection($event): void {
        const callback = (confirmed: boolean) => {
            if (confirmed) {
                this.connSrv.truncateCollection(this.collectionName)
                    .subscribe(data => {
                        this.reloadCollections.emit(null);
                    }, error => {
                        this.meSrv.show([
                            `<pre>${JSON.stringify(JSON.parse(error._body), null, 2)}</pre>`
                        ], `${error.status}: ${error.statusText}`);
                    });
            }
        };
        this.mcSrv.confirm([
            `You are about to truncate collection '${this.collectionName}'. This action can not be undone.`,
            `Are you sure?`
        ], callback, 'Truncate collection');
    }

    ngOnInit() {
    }
}
