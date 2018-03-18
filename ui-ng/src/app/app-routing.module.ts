import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageEndpointsComponent } from './pages/endpoints/endpoints.component';
import { PageHomeComponent } from './pages/home/home.component';
import { PageLoginComponent } from './pages/login/login.component';
import { PageMainComponent } from './pages/main/main.component';
import { CollectionDataComponent as CleverEditorCollectionDataComponent } from './clever-editor';
import { CollectionEditComponent as CleverEditorCollectionEditComponent } from './clever-editor';
import { CollectionsComponent as CleverEditorCollectionsComponent } from './clever-editor';

import { AuthGuard } from './app.guard';

const routes: Routes = [
    { path: '', component: PageHomeComponent, canActivate: [AuthGuard] },
    { path: 'ce/collections/:collectionName/:id', component: CleverEditorCollectionEditComponent, canActivate: [AuthGuard] },
    { path: 'ce/collections/:collectionName', component: CleverEditorCollectionDataComponent, canActivate: [AuthGuard] },
    { path: 'ce/collections', component: CleverEditorCollectionsComponent, canActivate: [AuthGuard] },
    { path: 'endpoints', component: PageEndpointsComponent, canActivate: [AuthGuard] },
    { path: 'main', component: PageMainComponent, canActivate: [AuthGuard] },
    { path: 'login', component: PageLoginComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
