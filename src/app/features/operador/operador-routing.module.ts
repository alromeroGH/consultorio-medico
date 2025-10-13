import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperadorComponent } from './operador.component';
import { GestionAgendaComponent } from './components/gestion-agenda/gestion-agenda.component';
import { NuevoPacienteComponent } from './components/nuevo-paciente/nuevo-paciente.component';
import { authGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: OperadorComponent },
  { path: 'gestion-agenda', component: GestionAgendaComponent, canActivate: [authGuard], data: { roles: ['operador'] } },
  { path: 'nuevo-paciente', component: NuevoPacienteComponent, canActivate: [authGuard], data: { roles: ['operador'] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperadorRoutingModule { }
