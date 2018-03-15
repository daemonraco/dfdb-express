import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { CollectionComponent } from './collection/collection.component';
import { CollectionDeleteComponent } from './collection/delete/delete.component';
import { CollectionGetComponent } from './collection/get/get.component';
import { CollectionGetIdComponent } from './collection/get-id/get-id.component';
import { CollectionPostComponent } from './collection/post/post.component';
import { CollectionPutComponent } from './collection/put/put.component';
import { CollectionResultsComponent } from './collection/results/results.component';
import { CollectionSchemaComponent } from './collection/schema/schema.component';
import { ErrorModalComponent } from './error-modal/error-modal.component';
import { FooterComponent } from './footer/footer.component';
import { LastUrlComponent } from './last-url/last-url.component';
import { MainPageComponent } from './main-page/main-page.component';
import { NavbarComponent } from './navbar/navbar.component';

import { ErrorModalService } from './services/error-modal.service';
import { LastUrlService } from './services/last-url.service';

@NgModule({
    declarations: [
        AppComponent,
        CollectionComponent,
        CollectionDeleteComponent,
        CollectionGetComponent,
        CollectionGetIdComponent,
        CollectionPostComponent,
        CollectionPutComponent,
        CollectionResultsComponent,
        CollectionSchemaComponent,
        ErrorModalComponent,
        FooterComponent,
        LastUrlComponent,
        MainPageComponent,
        NavbarComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        Angular2FontawesomeModule,
        AppRoutingModule
    ],
    providers: [
        ErrorModalService,
        LastUrlService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
