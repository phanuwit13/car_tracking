import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoutesPage } from './routes.page';

const routes: Routes = [
  {
    path: '',
    component: RoutesPage
  },
  {
    path: 'edit/:route_id',
    loadChildren: () => import('./edit/edit.module').then( m => m.EditPageModule)
  },
  {
    path: 'addgo',
    loadChildren: () => import('./addgo/addgo.module').then( m => m.AddgoPageModule)
  },
  {
    path: 'addback',
    loadChildren: () => import('./addback/addback.module').then( m => m.AddbackPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutesPageRoutingModule {}
