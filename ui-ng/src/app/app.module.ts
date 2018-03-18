import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';

import { AppComponent } from './app.component';
import { AuthGuard } from './app.guard';

import { AppRoutingModule } from './app-routing.module';
import { CollectionModule } from './collection';
import { ModalsModule } from './modals';
import { ServicesModule } from './services';

import { FooterComponent } from './footer/footer.component';
import { LastUrlComponent } from './last-url/last-url.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PageEndpointsComponent } from './pages/endpoints/endpoints.component';
import { PageHomeComponent } from './pages/home/home.component';
import { PageLoginComponent } from './pages/login/login.component';
import { PageMainComponent } from './pages/main/main.component';

@NgModule({
    declarations: [
        AppComponent,
        FooterComponent,
        LastUrlComponent,
        NavbarComponent,
        PageEndpointsComponent,
        PageLoginComponent,
        PageMainComponent,
        PageHomeComponent
    ],
    imports: [
        Angular2FontawesomeModule,
        AppRoutingModule,
        BrowserModule,
        CollectionModule,
        FormsModule,
        HttpModule,
        ModalsModule,
        ServicesModule
    ],
    providers: [
        AuthGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
