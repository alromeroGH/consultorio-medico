import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicoRoutingModule } from './medico-routing.module';
import { MedicoComponent } from './medico.component';
import { TurnosProgramadosComponent } from './components/turnos-programados/turnos-programados.component';
import { GestionAgendaComponent } from './components/gestion-agenda/gestion-agenda.component';


@NgModule({
  declarations: [
    MedicoComponent,
    TurnosProgramadosComponent,
    GestionAgendaComponent
  ],
  imports: [
    CommonModule,
    MedicoRoutingModule
  ]
})
export class MedicoModule { }
