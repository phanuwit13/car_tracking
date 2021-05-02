import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NumberRoutePageRoutingModule } from './number-route-routing.module';

import { NumberRoutePage } from './number-route.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NumberRoutePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [NumberRoutePage]
})
export class NumberRoutePageModule {}
