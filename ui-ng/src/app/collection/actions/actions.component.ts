import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'ui-collection-actions',
    templateUrl: './actions.component.html',
    styles: []
})
export class CollectionActionsComponent implements OnInit {
    @Input('collection') public collectionName: string;

    constructor() {
    }

    ngOnInit() {
    }
}
