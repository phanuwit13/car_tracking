import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarPageRoutingModule } from './car-routing.module';

import { CarPage } from './car.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CarPage]
})
export class CarPageModule {}
