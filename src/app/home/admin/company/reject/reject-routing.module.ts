import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RejectPage } from './reject.page';

const routes: Routes = [
  {
    path: '',
    component: RejectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RejectPageRoutingModule {}
