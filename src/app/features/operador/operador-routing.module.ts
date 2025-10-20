import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperadorComponent } from './operador.component';
import { GestionAgendaComponent } from './components/gestion-agenda/gestion-agenda.component';
import { PacienteDelDiaComponent  } from './components/paciente-del-dia/paciente-del-dia.component';
import { CrearPacienteComponent } from './components/crear-paciente/crear-paciente.component';
import { AsignarTurnoComponent } from './components/asignar-turno/asignar-turno.component';
import { authGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: OperadorComponent,
  },
  {
    path: 'crear-paciente',
    component: CrearPacienteComponent,
    canActivate: [authGuard],
    data: { roles: ['operador'] }
  },
  {
    path: 'gestion-agenda',
    component: GestionAgendaComponent,
    canActivate: [authGuard],
    data: { roles: ['operador'] }
  },
  {
    path: 'asignar-turno',
    component: AsignarTurnoComponent,
    canActivate: [authGuard],
    data: { roles: ['operador'] }
  },
  {
    path: 'paciente-del-dia',
    component: PacienteDelDiaComponent ,
    canActivate: [authGuard],
    data: { roles: ['operador'] }
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class OperadorRoutingModule { }
