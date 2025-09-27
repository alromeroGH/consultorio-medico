import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { GestionUsuariosComponent } from './components/gestion-usuarios/gestion-usuarios.component';
import { GestionEspecialidadesComponent } from './components/gestion-especialidades/gestion-especialidades.component';
import { GestionCoberturasComponent } from './components/gestion-coberturas/gestion-coberturas.component';


@NgModule({
  declarations: [
    AdminComponent,
    GestionUsuariosComponent,
    GestionEspecialidadesComponent,
    GestionCoberturasComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
