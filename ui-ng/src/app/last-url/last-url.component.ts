import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { LastUrlData, LastUrlService } from '../services/last-url.service';

@Component({
    selector: 'ui-last-url',
    templateUrl: './last-url.component.html',
    styles: []
})
export class LastUrlComponent implements OnDestroy, OnInit {
    @Input('delay') public delay: number = 500;

    public methodClass: string = '';
    public pendingUrls: LastUrlData[] = [];
    public url: LastUrlData = null;

    constructor(private luSrv: LastUrlService) {
    }

    ngOnDestroy() {
        this.luSrv.currentUrl().unsubscribe();
    }
    ngOnInit() {
        this.luSrv.currentUrl().subscribe((url: LastUrlData) => this.pendingUrls.push(url));
        this.startUrlRound();
    }

    protected startUrlRound() {
        setInterval(() => {
            const aux: LastUrlData = this.pendingUrls.shift();
            if (aux) {
                this.url = aux;
                this.methodClass = `badge-method-${aux.method.toLowerCase()}`;
            }
        }, this.delay);
    }
}
