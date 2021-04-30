import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddbackPage } from './addback.page';

const routes: Routes = [
  {
    path: '',
    component: AddbackPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddbackPageRoutingModule {}
