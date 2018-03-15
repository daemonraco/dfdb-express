import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { ModalConfirmData, ModalConfirmService } from '../../services/modal-confirm.service';

declare var $: any;

@Component({
    selector: 'ui-modal-confirm',
    templateUrl: './confirm.component.html',
    styles: []
})
export class ModalConfirmComponent implements OnDestroy, OnInit {
    @ViewChild('modal') protected modal: any;

    public confirmed: boolean = false;
    public data: ModalConfirmData = new ModalConfirmData();

    constructor(private mcSrv: ModalConfirmService) {
    }

    ngOnDestroy() {
        this.mcSrv.currentData().unsubscribe();
    }
    ngOnInit() {
        this.mcSrv.currentData().subscribe((data: ModalConfirmData) => {
            this.data = data;
            if (data.active) {
                this.confirmed = false;
                $(this.modal.nativeElement).modal('show');
            } else {
                this.data.callback = null;
                $(this.modal.nativeElement).modal('hide');
            }
        });
        $(this.modal.nativeElement).on('hidden.bs.modal', (e) => {
            if (typeof this.data.callback === 'function') {
                this.data.callback(this.confirmed);
                this.data.callback = null;
            }
        });
    }
}
