import { Component, OnInit } from '@angular/core';

declare var DFDBConfig;

@Component({
    selector: 'ui-me',
    templateUrl: './me.component.html',
    styles: []
})
export class MeComponent implements OnInit {
    public url: string = '';

    constructor() {
    }

    attendError(): void {
        this.url = `${DFDBConfig.uiUri}/assets/icon-24px.png`;
    }

    ngOnInit() {
        this.url = `http://www.daemonraco.com/site/images/favicon.png`;
    }
}
