import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PacienteComponent } from './paciente.component';
import { DatosPersonalesComponent } from './components/datos-personales/datos-personales.component';
import { MisTurnosComponent } from './components/mis-turnos/mis-turnos.component';
import { NuevoTurnoComponent } from './components/nuevo-turno/nuevo-turno.component';
import { authGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: PacienteComponent },
  { path: 'datos-personales', component: DatosPersonalesComponent, canActivate: [authGuard], data: { roles: ['paciente'] } },
  { path: 'mis-turnos', component: MisTurnosComponent, canActivate: [authGuard], data: { roles: ['paciente'] } },
  { path: 'nuevo-turno', component: NuevoTurnoComponent, canActivate: [authGuard], data: { roles: ['paciente'] } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PacienteRoutingModule { }
