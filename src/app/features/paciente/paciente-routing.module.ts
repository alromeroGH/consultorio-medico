import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PacienteComponent } from './paciente.component';
import { MisTurnosComponent } from './components/mis-turnos/mis-turnos.component';
import { DatosPersonalesComponent } from './components/datos-personales/datos-personales.component';
import { NuevoTurnoComponent } from './components/nuevo-turno/nuevo-turno.component';

const routes: Routes = [{ path: '', component: PacienteComponent }, { path: 'mis-turnos', component: MisTurnosComponent }, { path: 'perfil', component: DatosPersonalesComponent }, { path: 'nuevo-turno', component: NuevoTurnoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PacienteRoutingModule { }
