import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageEndpointsComponent } from './pages/endpoints/endpoints.component';
import { PageLoginComponent } from './pages/login/login.component';
import { PageMainComponent } from './pages/main/main.component';

import { AuthGuard } from './app.guard';

const routes: Routes = [
    { path: '', component: PageMainComponent, canActivate: [AuthGuard] },
    { path: 'main', component: PageMainComponent, canActivate: [AuthGuard] },
    { path: 'login', component: PageLoginComponent },
    { path: 'endpoints', component: PageEndpointsComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
