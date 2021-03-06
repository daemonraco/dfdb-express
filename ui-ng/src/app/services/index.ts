import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AuthService } from './auth.service';
import { ConnectionService } from './connection.service';
import { LastUrlService } from './last-url.service';
import { LoadingService } from './loading.service';

export * from './auth.service';
export * from './connection.service';
export * from './last-url.service';
export * from './loading.service';

@NgModule({
    declarations: [],
    exports: [],
    imports: [
        BrowserModule,
        HttpModule
    ],
    providers: [
        AuthService,
        LastUrlService,
        LoadingService
    ]
})
export class ServicesModule { }