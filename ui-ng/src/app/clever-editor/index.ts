import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';

import { CollectionDataComponent } from './collection-data/collection-data.component';
import { CollectionEditComponent } from './collection-edit/collection-edit.component';
import { CollectionsComponent } from './collections/collections.component';

export { CollectionDataComponent } from './collection-data/collection-data.component';
export { CollectionEditComponent } from './collection-edit/collection-edit.component';
export { CollectionsComponent } from './collections/collections.component';

@NgModule({
    declarations: [
        CollectionDataComponent,
        CollectionEditComponent,
        CollectionsComponent
    ],
    exports: [
        CollectionDataComponent,
        CollectionEditComponent,
        CollectionsComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        Angular2FontawesomeModule
    ]
})
export class CleverEditorModule { }