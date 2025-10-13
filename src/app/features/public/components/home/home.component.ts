import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  public token: string | null = null; 
  public isLoggedIn: boolean = false;
  public nombreUsuario: string | null = null;
  public rolUsuario: string | null = null;

  constructor(public authService: AuthService, public usuarioService: UsuarioService) {}

  ngOnInit() {
    this.cargarToken();
    this.cargarDatosUsuario();
  }

  cargarToken() {
    this.token = this.authService.getToken();
    this.isLoggedIn = !!this.token;
  }

  cargarDatosUsuario() {
    if (this.token) {
      this.rolUsuario = this.usuarioService.getUserRol();
    }
  }

  cerrarSesion() {
    this.authService.logout();
    window.location.reload();
  }
}
