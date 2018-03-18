import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AuthService } from './auth.service';
import { ConnectionService } from './connection.service';
import { LastUrlService } from './last-url.service';

export { AuthService } from './auth.service';
export { ConnectionService } from './connection.service';
export { LastUrlData, LastUrlService } from './last-url.service';

@NgModule({
    declarations: [],
    exports: [],
    imports: [
        BrowserModule,
        HttpModule
    ],
    providers: [
        AuthService,
        LastUrlService
    ]
})
export class ServicesModule { }