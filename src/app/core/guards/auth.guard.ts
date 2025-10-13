import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const usuarioService = inject(UsuarioService);
  const authService = inject(AuthService);
  
  const allowedRoles = route.data['roles'] as string[];
  
  const userRole = usuarioService.getUserRol();

  if (userRole && allowedRoles.includes(userRole)) {
    return true;
  }

  authService.redirectToHome();
  return false;
};
