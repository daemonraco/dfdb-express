import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'ui-results',
    templateUrl: './results.component.html',
    styles: []
})
export class CollectionResultsComponent implements OnInit {
    @Input('error') public error: any = null;
    @Input('results') public results: string = '';

    constructor() {
    }

    ngOnInit() {
    }
}
