import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionAgendaComponent } from './components/gestion-agenda/gestion-agenda.component';
import { PacienteDelDiaComponent } from './components/paciente-del-dia/paciente-del-dia.component';
import { OperadorComponent } from './operador.component';
import { OperadorRoutingModule } from './operador-routing.module';
import { AsignarTurnoComponent } from './components/asignar-turno/asignar-turno.component';

@NgModule({
  declarations: [
    OperadorComponent
  ],
  imports: [
    CommonModule,
    AsignarTurnoComponent,
    GestionAgendaComponent,
    PacienteDelDiaComponent,
    OperadorRoutingModule
  ]
})
export class OperadorModule { }
