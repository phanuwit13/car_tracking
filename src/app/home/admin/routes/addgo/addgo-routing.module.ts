import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddgoPage } from './addgo.page';

const routes: Routes = [
  {
    path: '',
    component: AddgoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddgoPageRoutingModule {}
