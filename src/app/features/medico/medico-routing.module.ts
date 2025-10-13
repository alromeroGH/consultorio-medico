import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicoComponent } from './medico.component';
import { GestionAgendaComponent } from './components/gestion-agenda/gestion-agenda.component';
import { TurnosProgramadosComponent } from './components/turnos-programados/turnos-programados.component';
import { authGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: MedicoComponent },
  { path: 'gestion-agenda', component: GestionAgendaComponent, canActivate: [authGuard], data: { roles: ['medico']} },
  { path: 'turnos-programados', component: TurnosProgramadosComponent,  canActivate: [authGuard], data: { roles: ['medico']} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicoRoutingModule { }
