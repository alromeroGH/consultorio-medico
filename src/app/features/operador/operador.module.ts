import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionAgendaComponent } from './components/gestion-agenda/gestion-agenda.component';
import { NuevoPacienteComponent } from './components/nuevo-paciente/nuevo-paciente.component';
import { PacienteDelDiaComponent } from './components/paciente-del-dia/paciente-del-dia.component';
import { OperadorComponent } from './operador.component';
import { OperadorRoutingModule } from './operador-routing.module';

@NgModule({
  declarations: [
    OperadorComponent
  ],
  imports: [
    CommonModule,
    GestionAgendaComponent,
    NuevoPacienteComponent,
    PacienteDelDiaComponent,
    OperadorRoutingModule
  ]
})
export class OperadorModule { }