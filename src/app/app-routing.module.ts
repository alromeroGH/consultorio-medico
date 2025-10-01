import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) }, { path: 'public', loadChildren: () => import('./features/public/public.module').then(m => m.PublicModule) }, { path: 'admin', loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule) }, { path: 'paciente', loadChildren: () => import('./features/paciente/paciente.module').then(m => m.PacienteModule) }, { path: 'medico', loadChildren: () => import('./features/medico/medico.module').then(m => m.MedicoModule) }, { path: 'operador', loadChildren: () => import('./features/operador/operador.module').then(m => m.OperadorModule) }, { path: 'shared', loadChildren: () => import('./shared/shared.module').then(m => m.SharedModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
