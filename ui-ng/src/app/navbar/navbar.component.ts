import { Component, OnInit } from '@angular/core';

declare var DFDBConfig;

@Component({
    selector: 'ui-navbar',
    templateUrl: './navbar.component.html',
    styles: []
})
export class NavbarComponent implements OnInit {
    public restUri: string = '';

    constructor() {
    }

    ngOnInit() {
        this.restUri = DFDBConfig.restUri;
    }
}
