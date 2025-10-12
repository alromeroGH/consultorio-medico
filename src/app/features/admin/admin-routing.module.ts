import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { GestionUsuariosComponent } from './components/gestion-usuarios/gestion-usuarios.component';
import { GestionEspecialidadesComponent } from './components/gestion-especialidades/gestion-especialidades.component';
import { GestionCoberturasComponent } from './components/gestion-coberturas/gestion-coberturas.component';

const routes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'gestion-usuarios', component: GestionUsuariosComponent },
  { path: 'gestion-especialidades', component: GestionEspecialidadesComponent },
  { path: 'gestion-coberturas', component: GestionCoberturasComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
