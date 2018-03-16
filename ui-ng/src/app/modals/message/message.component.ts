import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { ModalMessageData, ModalMessageService } from '../../services/modal-message.service';

declare var $: any;

@Component({
    selector: 'ui-modal-message',
    templateUrl: './message.component.html',
    styles: []
})
export class ModalMessageComponent implements OnDestroy, OnInit {
    @ViewChild('modal') protected modal: any;

    public data: ModalMessageData = new ModalMessageData();

    constructor(private meSrv: ModalMessageService) {
    }

    ngOnDestroy() {
        this.meSrv.currentData().unsubscribe();
    }
    ngOnInit() {
        this.meSrv.currentData().subscribe((data: ModalMessageData) => {
            this.data = data;
            if (data.active) {
                $(this.modal.nativeElement).modal('show');
            } else {
                $(this.modal.nativeElement).modal('hide');
            }
        });
    }
}
