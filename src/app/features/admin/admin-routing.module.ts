import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { GestionUsuariosComponent } from './components/gestion-usuarios/gestion-usuarios.component';
import { GestionEspecialidadesComponent } from './components/gestion-especialidades/gestion-especialidades.component';
import { GestionCoberturasComponent } from './components/gestion-coberturas/gestion-coberturas.component';
import { authGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'gestion-usuarios', component: GestionUsuariosComponent, canActivate: [authGuard], data: { roles: ['admin'] } },
  { path: 'gestion-especialidades', component: GestionEspecialidadesComponent, canActivate: [authGuard], data: { roles: ['admin'] } },
  { path: 'gestion-coberturas', component: GestionCoberturasComponent, canActivate: [authGuard], data: { roles: ['admin'] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
