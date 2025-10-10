import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicoComponent } from './medico.component';
import { GestionAgendaComponent } from './components/gestion-agenda/gestion-agenda.component';
import { TurnosProgramadosComponent } from './components/turnos-programados/turnos-programados.component';

const routes: Routes = [
  { path: '', component: MedicoComponent },
  { path: 'gestion-agenda', component: GestionAgendaComponent },
  { path: 'turnos-programados', component: TurnosProgramadosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicoRoutingModule { }
