import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip'; 

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule,
    MatTooltipModule, 
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  public token: string | null = null;
  public isLoggedIn: boolean = false;
  public nombreUsuario: string | null = null;
  public rolUsuario: string | null = null;
  public rolTooltip: string = '';

  constructor(
    private router: Router, 
    public authService: AuthService, 
    public usuarioService: UsuarioService
  ) {}

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
      this.nombreUsuario = this.usuarioService.getUserName();
      this.rolUsuario = this.usuarioService.getUserRol();
      this.rolTooltip = `Rol: ${this.rolUsuario || 'No definido'}`;
    }
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/public/home']).then(() => {
      window.location.reload();
    });
  }
}
