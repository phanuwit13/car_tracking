import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddgoPageRoutingModule } from './addgo-routing.module';

import { AddgoPage } from './addgo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddgoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddgoPage]
})
export class AddgoPageModule {}
