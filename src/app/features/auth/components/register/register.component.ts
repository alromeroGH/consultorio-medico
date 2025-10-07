import {Component} from '@angular/core';
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
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

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
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSelectModule, NgIf, MatIconModule, MatDatepickerModule, MatNativeDateModule, MatDividerModule, MatButtonModule]
})
export class RegisterComponent {
  registerForm: FormGroup;
  passMatch: boolean = true;

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  nombreFormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  apellidoFormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  
  dniFormControl = new FormControl('', [Validators.required, 
    Validators.minLength(7), 
    Validators.maxLength(8),
    Validators.pattern('^[0-9]*$')]);

  passFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
  rePassFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);

  dateFormControl = new FormControl('', [Validators.required]);

  selectFormControl = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();

  constructor() {
    this.registerForm = new FormGroup({
      email: this.emailFormControl,
      nombre: this.nombreFormControl,
      apellido: this.apellidoFormControl,
      dni: this.dniFormControl,
      password: this.passFormControl,
      fechaCumpleanios: this.dateFormControl,
      cobertura: this.selectFormControl
    });
  }

  registrarNuevoUsuario(): void {
    if (this.passFormControl.value === this.rePassFormControl.value && this.registerForm.valid) {
      const credenciales = this.registerForm.value;
      this.passMatch = true;
      console.log(credenciales);
    } else {
      this.passMatch = false;
    }
  }
}
