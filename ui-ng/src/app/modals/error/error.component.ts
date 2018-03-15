import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { ModalErrorData, ModalErrorService } from '../../services/modal-error.service';

declare var $: any;

@Component({
    selector: 'ui-modal-error',
    templateUrl: './error.component.html',
    styles: []
})
export class ModalErrorComponent implements OnDestroy, OnInit {
    @ViewChild('modal') protected modal: any;

    public data: ModalErrorData = new ModalErrorData();

    constructor(private meSrv: ModalErrorService) {
    }

    ngOnDestroy() {
        this.meSrv.currentData().unsubscribe();
    }
    ngOnInit() {
        this.meSrv.currentData().subscribe((data: ModalErrorData) => {
            this.data = data;
            if (data.active) {
                $(this.modal.nativeElement).modal('show');
            } else {
                $(this.modal.nativeElement).modal('hide');
            }
        });
    }
}
