import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import * as $ from 'jquery';

import { ErrorModalData, ErrorModalService } from '../services/error-modal.service';

@Component({
    selector: 'ui-error-modal',
    templateUrl: './error-modal.component.html',
    styles: []
})
export class ErrorModalComponent implements OnDestroy, OnInit {
    @ViewChild('modalTrigger') protected modalTrigger: any;

    public data: ErrorModalData = new ErrorModalData();

    constructor(private emSrv: ErrorModalService) {
    }

    ngOnDestroy() {
        this.emSrv.currentData().unsubscribe();
    }
    ngOnInit() {
        this.emSrv.currentData().subscribe((data: ErrorModalData) => {
            this.data = data;
            if (data.active) {
                this.modalTrigger.nativeElement.click();
            }
        })
    }
}
