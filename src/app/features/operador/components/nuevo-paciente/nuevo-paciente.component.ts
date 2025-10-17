import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ErrorStateMatcher, MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';

import { AuthService } from 'src/app/core/services/auth.service';
import { CoberturasService } from 'src/app/core/services/coberturas.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-nuevo-paciente',
  templateUrl: './nuevo-paciente.component.html',
  styleUrls: ['../../../../features/auth/components/register/register.component.css'], 
  standalone: true, 
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatInputModule, 
    MatFormFieldModule, 
    MatButtonModule, 
    MatIconModule, 
    MatDatepickerModule, 
    MatSelectModule,
    MatNativeDateModule,
  ]
})
export class NuevoPacienteComponent implements OnInit { 

  pacienteForm: FormGroup;
  maxDate: Date = new Date();
  listaCoberturas: any[] = []; // Usando 'any[]'
  passMatch: boolean = true; 

  // ... (FormControls se mantienen igual)
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  nombreFormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  apellidoFormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  dniFormControl = new FormControl('', [
    Validators.required, 
    Validators.minLength(7), 
    Validators.maxLength(8),
    Validators.pattern('^[0-9]*$')
  ]);
  telefonoFormControl = new FormControl('', [
    Validators.required, 
    Validators.minLength(10), 
    Validators.maxLength(12),
    Validators.pattern('^[0-9]*$')
  ]);
  passFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
  rePassFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
  dateFormControl = new FormControl('', [Validators.required]);
  coberturaFormControl = new FormControl('', [Validators.required]);
  rolFormControl = new FormControl({ value: 'paciente', disabled: true }); 

  matcher = new MyErrorStateMatcher();

  constructor(private router: Router,
    private auth: AuthService,
    private coberturas: CoberturasService) {

    this.pacienteForm = new FormGroup({
      apellido: this.apellidoFormControl,
      nombre: this.nombreFormControl,
      fecha_nacimiento: this.dateFormControl,
      password: this.passFormControl,
      usuario: this.dniFormControl, 
      rol: this.rolFormControl,
      email: this.emailFormControl,
      telefono: this.telefonoFormControl,
      dni: this.dniFormControl,
      id_cobertura: this.coberturaFormControl
    });
  }

  ngOnInit(): void {
    this.getCoberturas();
  }

  crearPaciente(): void {
    if (this.passFormControl.value === this.rePassFormControl.value && this.pacienteForm.valid) {
      const credenciales: any = this.pacienteForm.getRawValue(); // Usando 'any'
      this.passMatch = true;

      const fecha = credenciales.fecha_nacimiento;
      const fechaFormateada = fecha instanceof Date
        ? fecha.toISOString().split('T')[0]
        : fecha; 

      const body: any = { // Usando 'any'
        apellido: credenciales.apellido,
        nombre: credenciales.nombre,
        fecha_nacimiento: fechaFormateada,
        password: credenciales.password,
        usuario: credenciales.dni, 
        rol:  'paciente', 
        email: credenciales.email,
        telefono: credenciales.telefono,
        dni: credenciales.dni,
        id_cobertura: credenciales.id_cobertura
      }

      this.auth.register(body).subscribe({
      next: (data) => {
        alert('Paciente creado exitosamente');
        this.pacienteForm.reset({ rol: 'paciente' }); 
      },
      error: (err) => {
        alert('Error al crear paciente. Verifique los datos (DNI/Email pueden ya existir).');
        console.error('Error de registro:', err);
      }
    });
    } else {
      this.passMatch = (this.passFormControl.value === this.rePassFormControl.value);
      alert('Por favor, complete correctamente el formulario y asegúrese que las contraseñas coincidan.');
    }
  }

  getCoberturas(): void {
    this.coberturas.getCoberturas().subscribe({
      next: (data: any) => { // Usando 'any'
        this.listaCoberturas = data.payload;
      },
      error: (err) => {
        console.error('Error cargando coberturas:', err);
      }
    });
  }
}