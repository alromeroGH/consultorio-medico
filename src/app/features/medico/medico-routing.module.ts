import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicoComponent } from './medico.component';
import { TurnosProgramadosComponent } from './components/turnos-programados/turnos-programados.component'; 
import { GestionAgendaComponent } from './components/gestion-agenda/gestion-agenda.component';

const routes: Routes = [{ path: '', component: MedicoComponent }, {path: 'turnos-programados', component: TurnosProgramadosComponent }, { path: 'gestion-agenda', component: GestionAgendaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicoRoutingModule { }
