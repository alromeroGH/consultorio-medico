import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';

import {MatTableModule} from '@angular/material/table';


@NgModule({
  declarations: [
    AdminComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatTableModule
  ]
})
export class AdminModule { }
