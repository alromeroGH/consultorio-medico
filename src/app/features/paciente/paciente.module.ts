import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PacienteRoutingModule } from './paciente-routing.module';
import { PacienteComponent } from './paciente.component';
import { NuevoTurnoComponent } from './components/nuevo-turno/nuevo-turno.component';
import { MisTurnosComponent } from './components/mis-turnos/mis-turnos.component';
import { DatosPersonalesComponent } from './components/datos-personales/datos-personales.component';


@NgModule({
  declarations: [
    PacienteComponent,
    NuevoTurnoComponent,
    MisTurnosComponent,
  ],
  imports: [
    CommonModule,
    PacienteRoutingModule,
    DatosPersonalesComponent
  ]
})
export class PacienteModule { }
