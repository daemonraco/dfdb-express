import { Component, OnDestroy, OnInit } from '@angular/core';

import { LoadingData, LoadingService } from '../services';

@Component({
    selector: 'ui-loading-overlay',
    templateUrl: './loading.component.html',
    styles: []
})
export class LoadingComponent implements OnDestroy, OnInit {
    protected lSub: any = null;

    public data: LoadingData = new LoadingData();

    constructor(private lSrv: LoadingService) {
    }

    ngOnDestroy() {
        this.lSub.unsubscribe();
        this.lSub = null;
    }
    ngOnInit() {
        this.lSub = this.lSrv.data().subscribe((data: LoadingData) => this.data = data);
    }
}
