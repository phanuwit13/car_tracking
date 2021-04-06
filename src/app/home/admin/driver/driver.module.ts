import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DriverPageRoutingModule } from './driver-routing.module';

import { DriverPage } from './driver.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DriverPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [DriverPage]
})
export class DriverPageModule {}
