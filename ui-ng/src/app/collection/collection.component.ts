import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'ui-collection',
    templateUrl: './collection.component.html',
    styles: []
})
export class CollectionComponent implements OnInit {
    @Input('collection') public collectionName: string;
    @Output('reloadCollections') public reloadCollections: EventEmitter<any> = new EventEmitter<any>();

    constructor() {
    }

    public forwardReloadCollections(event): void {
        this.reloadCollections.emit(event);
    }

    ngOnInit() {
    }
}
