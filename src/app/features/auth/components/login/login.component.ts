import { Component } from '@angular/core';
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

  constructor() {
    this.loginForm = new FormGroup({
      dni: this.dniFormControl,
      password: this.passFormControl
    });
  }

  iniciarSesion(): void {
    const credenciales = this.loginForm.value;
    console.log(credenciales);
  }
}
