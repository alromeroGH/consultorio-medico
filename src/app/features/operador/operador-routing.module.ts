import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperadorComponent } from './operador.component';
import { GestionAgendaComponent } from './components/gestion-agenda/gestion-agenda.component';  
import { NuevoPacienteComponent } from './components/nuevo-paciente/nuevo-paciente.component';  

const routes: Routes = [{ path: '', component: OperadorComponent }, {path: 'gestion-agenda', component: GestionAgendaComponent }, { path: 'nuevo-paciente', component: NuevoPacienteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperadorRoutingModule { }
