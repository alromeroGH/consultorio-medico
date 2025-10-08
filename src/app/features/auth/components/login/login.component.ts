import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from 'src/app/core/services/auth.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, NgIf, MatButtonModule]
})
export class LoginComponent {
  loginForm: FormGroup;

  dniFormControl = new FormControl('', [Validators.required, 
    Validators.minLength(7), 
    Validators.maxLength(8),
    Validators.pattern('^[0-9]*$')]);

  passFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);

  matcher = new MyErrorStateMatcher();

  constructor(private router: Router, 
    private auth: AuthService, 
    private user: UsuarioService) {

      // se hace el form para validar que todos los campos estén bien
    this.loginForm = new FormGroup({
      usuario: this.dniFormControl,
      password: this.passFormControl
    });
  }

  iniciarSesion(): void {
    const credenciales = this.loginForm.value;

    const body = {
      usuario: this.dniFormControl.value,
      password: this.passFormControl.value
    };

    this.auth.login(body).subscribe({
      next: (response) => {
        console.log('Login exitoso', response);

        if (response.codigo === 200) {
          this.auth.saveToken(response.jwt);
          this.user.saveUser(response.payload[0]);

          this.router.navigate(['/public/home']);
        } else {
          alert('Usuario o contraseña incorrectos')
        } 
      },
      error: (err) => {
        console.error('Fallo login', err);
      }
    });
  }

  registrarse(): void {
    this.router.navigate(['/auth/register']);
  }
}