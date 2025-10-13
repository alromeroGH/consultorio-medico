import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SharedComponent } from './shared.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { PopUpComponent } from './components/pop-up/pop-up.component';




@NgModule({
  declarations: [
    SharedComponent,
    FooterComponent,
    PopUpComponent
  ],
  imports: [
    HeaderComponent,
    MatIconModule,
    NgIf,
    CommonModule,
    SharedRoutingModule
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    PopUpComponent
  ]
})
export class SharedModule { }
