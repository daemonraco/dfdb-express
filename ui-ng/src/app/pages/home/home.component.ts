import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var DFDBConfig;

@Component({
    selector: 'ui-home',
    templateUrl: './home.component.html',
    styles: []
})
export class PageHomeComponent implements OnInit {
    public restUri: string = DFDBConfig.restUri;

    constructor(private router: Router) {
    }

    public database(event: any): void {
        this.router.navigateByUrl('/main');
    }
    public endpoints(event: any): void {
        this.router.navigateByUrl('/endpoints');
    }

    ngOnInit() {
    }
}
