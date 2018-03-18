import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';

import { ModalConfirmService } from './modal-confirm.service';
import { ModalErrorService } from './modal-error.service';
import { ModalMessageService } from './modal-message.service';

import { ModalConfirmComponent } from './confirm/confirm.component';
import { ModalErrorComponent } from './error/error.component';
import { ModalMessageComponent } from './message/message.component';

export { ModalConfirmData, ModalConfirmService } from './modal-confirm.service';
export { ModalErrorData, ModalErrorService } from './modal-error.service';
export { ModalMessageData, ModalMessageService } from './modal-message.service';

@NgModule({
    declarations: [
        ModalConfirmComponent,
        ModalErrorComponent,
        ModalMessageComponent
    ],
    exports: [
        ModalConfirmComponent,
        ModalErrorComponent,
        ModalMessageComponent
    ],
    imports: [
        Angular2FontawesomeModule,
        BrowserModule,
        FormsModule
    ],
    providers: [
        ModalConfirmService,
        ModalErrorService,
        ModalMessageService
    ]
})
export class ModalsModule { }
