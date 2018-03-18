import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';

export * from './collection.service';

import { CollectionComponent } from './collection.component';
import { CollectionActionsComponent } from './actions/actions.component';
import { CollectionDeleteComponent } from './delete/delete.component';
import { CollectionGetComponent } from './get/get.component';
import { CollectionGetIdComponent } from './get-id/get-id.component';
import { CollectionIndexesComponent } from './indexes/indexes.component';
import { CollectionPostComponent } from './post/post.component';
import { CollectionPutComponent } from './put/put.component';
import { CollectionResultsComponent } from './results/results.component';
import { CollectionSchemaComponent } from './schema/schema.component';

@NgModule({
    declarations: [
        CollectionComponent,
        CollectionActionsComponent,
        CollectionDeleteComponent,
        CollectionGetComponent,
        CollectionGetIdComponent,
        CollectionIndexesComponent,
        CollectionPostComponent,
        CollectionPutComponent,
        CollectionResultsComponent,
        CollectionSchemaComponent
    ],
    exports: [
        CollectionComponent,
        CollectionActionsComponent,
        CollectionDeleteComponent,
        CollectionGetComponent,
        CollectionGetIdComponent,
        CollectionIndexesComponent,
        CollectionPostComponent,
        CollectionPutComponent,
        CollectionResultsComponent,
        CollectionSchemaComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        Angular2FontawesomeModule
    ]
})
export class CollectionModule { }