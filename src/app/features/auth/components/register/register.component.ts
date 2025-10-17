import { Component, OnInit } from '@angular/core';
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
import { NgIf, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from 'src/app/core/services/auth.service';
import { CoberturasService } from 'src/app/core/services/coberturas.service';
import { Cobertura } from 'src/app/core/interfaces/cobertura.model';
import { UsuarioService } from 'src/app/core/services/usuario.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSelectModule, NgIf, NgFor, MatIconModule, MatDatepickerModule, MatNativeDateModule, MatDividerModule, MatButtonModule]
})
export class RegisterComponent implements OnInit {
  modoOperador: boolean = false;
  registerForm: FormGroup;
  passMatch: boolean = true;
  maxDate: Date = new Date();

  listaCoberturas: Cobertura[] = [];

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  nombreFormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  apellidoFormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  
  dniFormControl = new FormControl('', [Validators.required, 
    Validators.minLength(7), 
    Validators.maxLength(8),
    Validators.pattern('^[0-9]*$')]);

    telefonoFormControl = new FormControl('', [Validators.required, 
    Validators.minLength(10), 
    Validators.maxLength(12),
    Validators.pattern('^[0-9]*$')]);

  passFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
  rePassFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);

  dateFormControl = new FormControl('', [Validators.required]);

  selectFormControl = new FormControl('', [Validators.required]);

  rolFormControl = new FormControl({ value: 'paciente', disabled: true });

  matcher = new MyErrorStateMatcher();

  

  constructor(private router: Router,
    private auth: AuthService,
    private coberturas: CoberturasService,
    private usuarioService: UsuarioService) {

      // se hace el form para validar que todos los campos estén bien
    this.registerForm = new FormGroup({
      apellido: this.apellidoFormControl,
      nombre: this.nombreFormControl,
      fecha_nacimiento: this.dateFormControl,
      password: this.passFormControl,
      usuario: this.nombreFormControl,
      rol:  this.rolFormControl,
      email: this.emailFormControl,
      telefono: this.telefonoFormControl,
      dni: this.dniFormControl,
      id_cobertura: this.selectFormControl
    });
  }

  ngOnInit(): void {
    this.getCoberturas();
    this.validarOperador();
  }

validarOperador(): void {
  if(this.usuarioService.getUserRol() === 'operador') {
    this.modoOperador = true;
  }
}

  registrarNuevoUsuario(): void {if (this.passFormControl.value === this.rePassFormControl.value && this.registerForm.valid) {
      const credenciales = this.registerForm.value;
      this.passMatch = true;

       // Transformar la fecha a string "YYYY-MM-DD"
      const fecha = credenciales.fecha_nacimiento;
      const fechaFormateada = fecha instanceof Date
        ? fecha.toISOString().split('T')[0]
        : fecha; // por si ya viene como string

      const body = {
        apellido: this.apellidoFormControl.value,
        nombre: this.nombreFormControl.value,
        fecha_nacimiento: fechaFormateada,
        password: this.passFormControl.value,
        usuario: this.nombreFormControl.value,
        rol:  this.rolFormControl.value,
        email: this.emailFormControl.value,
        telefono: this.telefonoFormControl.value,
        dni: this.dniFormControl.value,
        id_cobertura: this.selectFormControl.value
      }

      this.auth.register(body).subscribe({
      next: (data) => {
        console.log(data)

        if (this.modoOperador) {
          alert('Usuario creado exitosamente');
          this.router.navigate(['/public/home'])
        } else {
          alert('Usuario logueado exitosamente');
          this.router.navigate(['/auth/login']);
        }
      },
      error: (err) => {
        console.error('Error de registro:', err);
      }
    });
    } else {
      this.passMatch = false;
    }
  }

  volverLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  getCoberturas(): void {
    this.coberturas.getCoberturas().subscribe({
      next: (data) => {
        this.listaCoberturas = data.payload;
      },
      error: (err) => {
        console.error('Error cargando coberturas:', err);
      }
    });
  }
}