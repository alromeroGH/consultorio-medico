import {Component} from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

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
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSelectModule, MatIconModule, MatDatepickerModule, MatNativeDateModule, MatDividerModule, MatButtonModule]
})
export class RegisterComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  nombreFormControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
  apellidoFormControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
  
  dniFormControl = new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]);

  passFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
  rePassFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);

  dateFormControl = new FormControl('', [Validators.required]);

  selectFormControl = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();
}
