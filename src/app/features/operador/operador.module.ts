import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperadorRoutingModule } from './operador-routing.module';
import { OperadorComponent } from './operador.component';
import { GestionAgendaComponent } from './components/gestion-agenda/gestion-agenda.component';
import { NuevoPacienteComponent } from './components/nuevo-paciente/nuevo-paciente.component';


@NgModule({
  declarations: [
    OperadorComponent,
    GestionAgendaComponent,
    NuevoPacienteComponent
  ],
  imports: [
    CommonModule,
    OperadorRoutingModule
  ]
})
export class OperadorModule { }
