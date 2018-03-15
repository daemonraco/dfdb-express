import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'ui-collection',
    templateUrl: './collection.component.html',
    styles: []
})
export class CollectionComponent implements OnInit {
    @Input('collection') public collectionName: string;

    constructor() {
    }

    ngOnInit() {
    }
}
