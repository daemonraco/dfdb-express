import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ConnectionService, LoadingService } from '../../services';
import { ModalConfirmService, ModalErrorService } from '../../modals';

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
        private lSrv: LoadingService,
        private mcSrv: ModalConfirmService,
        private meSrv: ModalErrorService) {
    }

    public dropCollection($event): void {
        const callback = (confirmed: boolean) => {
            if (confirmed) {
                this.lSrv.show();

                this.connSrv.dropCollection(this.collectionName)
                    .subscribe(data => {
                        this.reloadCollections.emit(null);
                        this.lSrv.hide();
                    }, error => {
                        this.lSrv.hide();
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
                this.lSrv.show();

                this.connSrv.truncateCollection(this.collectionName)
                    .subscribe(data => {
                        this.reloadCollections.emit(null);
                        this.lSrv.hide();
                    }, error => {
                        this.lSrv.hide();
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
