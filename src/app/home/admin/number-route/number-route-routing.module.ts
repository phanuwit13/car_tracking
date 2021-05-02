import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NumberRoutePage } from './number-route.page';

const routes: Routes = [
  {
    path: '',
    component: NumberRoutePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NumberRoutePageRoutingModule {}
