import { Component } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { Cobertura } from 'src/app/core/interfaces/cobertura.model';
import { CoberturasService } from 'src/app/core/services/coberturas.service';
import { AuthService } from 'src/app/core/services/auth.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface UsuarioElement {
  id: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  password: string;
  usuario: string;
  rol: string;
  email: string;
  telefono: string;
  dni: string;
  id_cobertura: string;
}

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, NgFor, MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatDividerModule, MatTableModule, MatButtonModule, MatIconModule]
})
export class GestionUsuariosComponent implements OnInit {

  // LISTAR USUARIOS

  datasource = new MatTableDataSource<UsuarioElement>([]);

  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'fecha_nacimiento', 'password', 'usuario', 'rol', 'email', 'telefono', 'dni', 'id_cobertura', 'editar'];
  dataSource = this.datasource;

  ngOnInit(): void {
    this.getCoberturas();
    this.getUsers();
  }

  getUsers(): void {
    this.usuario.getUsers().subscribe({
      next: (data) => {
        const usuariosObtenidos: UsuarioElement[] = [];

        for (let d of data.payload) {
          let datos = {
            id: d.id,
            nombre: d.nombre,
            apellido: d.apellido,
            fecha_nacimiento: d.fecha_nacimiento,
            password: d.password,
            usuario: d.usuario,
            rol: d.rol,
            email: d.email,
            telefono: d.telefono,
            dni: d.dni,
            id_cobertura: d.id_cobertura
          };
          usuariosObtenidos.push(datos);
        }
        this.datasource.data = usuariosObtenidos;
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
      }
    });
  }

  // FILTRO TABLA
  applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

    // CREAR USUARIOS

    createUserForm: FormGroup;
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
  
    dateFormControl = new FormControl('', [Validators.required]);
  
    coberturaFormControl = new FormControl('', [Validators.required]);
  
    rolFormControl = new FormControl('', [Validators.required]);
  
    matcher = new MyErrorStateMatcher();

  constructor(private usuario: UsuarioService,
    private auth: AuthService,
    private coberturas: CoberturasService
  ) {
     this.createUserForm = new FormGroup({
      apellido: this.apellidoFormControl,
      nombre: this.nombreFormControl,
      fecha_nacimiento: this.dateFormControl,
      password: this.passFormControl,
      usuario: this.dniFormControl,
      rol:  this.rolFormControl,
      email: this.emailFormControl,
      telefono: this.telefonoFormControl,
      dni: this.dniFormControl,
      id_cobertura: this.coberturaFormControl
    });
  }

  crearNuevoUsuario(): void {
    this.buttonUpdate = false;

    if (this.createUserForm.valid) {
      const credenciales = this.createUserForm.value;

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
        id_cobertura: this.coberturaFormControl.value
      }

      this.auth.register(body).subscribe({
      next: (data) => {
        console.log(data)
        alert('Usuario creado exitosamente');

        this.createUserForm.reset();

        this.getUsers();
      },
      error: (err) => {
        console.error('Error de creacion:', err);
      }
    });

      this.createUserForm.clearValidators();
    } else {
      alert('Error al crear usuario');
    }
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

  // ACTUALIZAR USUARIO
  buttonUpdate: boolean = false;

  actualizarUsuario(): void {

     if (this.createUserForm.valid) {
      const credenciales = this.createUserForm.value;

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
        id_cobertura: this.coberturaFormControl.value
      }

      let idStr = this.usuario.getUserUpdate();

      if (idStr) {
        let id = parseInt(idStr);
        this.usuario.updateUser(body, id).subscribe({
          
        });

        alert('Usuario actualizado')
        this.createUserForm.reset();
      }
     }

     this.buttonUpdate = false;
     this.getUsers();
  }

  getUser(id: number): number {
    this.usuario.getUser(id).subscribe({
      next: (data) => {
        let datosUser = data.payload[0];

        this.usuario.saveUserUpdate(datosUser);

        this.createUserForm.reset({
          apellido: datosUser.apellido,
          nombre: datosUser.nombre,
          fecha_nacimiento: datosUser.fecha_nacimiento,
          password: datosUser.password,
          usuario: datosUser.usuario,
          rol: datosUser.rol,
          email: datosUser.email,
          telefono: datosUser.telefono,
          dni: datosUser.dni,
          id_cobertura: datosUser.id_cobertura
        });

        this.buttonUpdate = true;

        return datosUser.id;
      },
      error: (err) => {
        console.error('Error al obtener el usuario ' + err);  
        alert('Error al obtener el usuario')
      }
    });

    return 0;
  }
}