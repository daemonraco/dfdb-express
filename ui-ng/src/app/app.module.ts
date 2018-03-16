import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AuthGuard } from './app.guard';
import { AuthService } from './services/auth.service';

import { CollectionComponent } from './collection/collection.component';
import { CollectionActionsComponent } from './collection/actions/actions.component';
import { CollectionDeleteComponent } from './collection/delete/delete.component';
import { CollectionGetComponent } from './collection/get/get.component';
import { CollectionGetIdComponent } from './collection/get-id/get-id.component';
import { CollectionIndexesComponent } from './collection/indexes/indexes.component';
import { CollectionPostComponent } from './collection/post/post.component';
import { CollectionPutComponent } from './collection/put/put.component';
import { CollectionResultsComponent } from './collection/results/results.component';
import { CollectionSchemaComponent } from './collection/schema/schema.component';
import { FooterComponent } from './footer/footer.component';
import { LastUrlComponent } from './last-url/last-url.component';
import { ModalConfirmComponent } from './modals/confirm/confirm.component';
import { ModalErrorComponent } from './modals/error/error.component';
import { ModalMessageComponent } from './modals/message/message.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PageEndpointsComponent } from './pages/endpoints/endpoints.component';
import { PageLoginComponent } from './pages/login/login.component';
import { PageMainComponent } from './pages/main/main.component';

import { LastUrlService } from './services/last-url.service';
import { ModalConfirmService } from './services/modal-confirm.service';
import { ModalErrorService } from './services/modal-error.service';
import { ModalMessageService } from './services/modal-message.service';

@NgModule({
    declarations: [
        AppComponent,
        CollectionComponent,
        CollectionActionsComponent,
        CollectionDeleteComponent,
        CollectionGetComponent,
        CollectionGetIdComponent,
        CollectionIndexesComponent,
        CollectionPostComponent,
        CollectionPutComponent,
        CollectionResultsComponent,
        CollectionSchemaComponent,
        FooterComponent,
        LastUrlComponent,
        ModalConfirmComponent,
        ModalErrorComponent,
        ModalMessageComponent,
        NavbarComponent,
        PageLoginComponent,
        PageMainComponent,
        PageEndpointsComponent,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        Angular2FontawesomeModule,
        AppRoutingModule
    ],
    providers: [
        AuthGuard,
        AuthService,
        LastUrlService,
        ModalConfirmService,
        ModalErrorService,
        ModalMessageService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
