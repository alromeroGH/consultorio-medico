import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { CoberturasService } from 'src/app/core/services/coberturas.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PopUpComponent } from 'src/app/shared/components/pop-up/pop-up.component';

@Component({
  selector: 'app-datos-personales',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule
  ],
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.css'],
})
export class DatosPersonalesComponent {
  
  public modoEdicion: boolean = false;
  public usuarioForm: FormGroup;

  public coberturas$: Observable<any> | null = null;

  public nombreUsuario: string | null = null;
  public apellidoUsuario: string | null = null;
  public rolUsuario: string | null = null;
  public fechaNacimientoUsuario: Date | null = null;
  public dniUsuario: string | null = null;
  public emailUsuario: string | null = null
  public telefonoUsuario: string | null = null
  public coberturaUsuario: number | null = null; 

  public userIdString: string = this.usuarioService.getUserId() || '';
  public userIdNumber: number = parseInt(
    this.usuarioService.getUserId() || '0',
    10
  );

  constructor(public usuarioService: UsuarioService, private fb: FormBuilder, private coberturasService: CoberturasService, private router: Router, private dialog: MatDialog) {
    this.usuarioForm = this.fb.group({
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ],
      dni: [{ value: '', disabled: true }],
      telefono: [{ value: '', disabled: true }],
      cobertura: [{ value: '', disabled: true }],
      nuevaContraseña: ['', [Validators.minLength(8)]], 
    });
  }

  ngOnInit() {
    this.cargarDatosUsuario();
    this.cargarOpcionesCobertura();
  }

  cargarOpcionesCobertura() {
  this.coberturas$ = this.coberturasService.getCoberturas().pipe(
    map((response: any) => {
      return response.payload || []; 
    })
  );
}

  cargarDatosUsuario() {
    this.usuarioService.getUser(this.userIdNumber).subscribe({
      next: (response: any) => {
        const datosUsuarioArray = response.payload;

        if (
          datosUsuarioArray &&
          Array.isArray(datosUsuarioArray) &&
          datosUsuarioArray.length > 0
        ) {
          const usuario = datosUsuarioArray[0];

          this.nombreUsuario = usuario.nombre;
          this.apellidoUsuario = usuario.apellido;
          this.rolUsuario = usuario.rol;
          this.fechaNacimientoUsuario = usuario.fecha_nacimiento;
          this.dniUsuario = usuario.dni;
          this.emailUsuario = usuario.email;
          this.telefonoUsuario = usuario.telefono;
          this.coberturaUsuario = usuario.id_cobertura; 

          this.usuarioForm.setValue({
            email: usuario.email || '',
            dni: usuario.dni || '',
            telefono: usuario.telefono || '',
            cobertura: usuario.id_cobertura || '', 
            nuevaContraseña: usuario.password || '',
          });

          this.usuarioForm.disable();
        } else {
          console.error(
            'No se encontró el usuario o la estructura de la respuesta es incorrecta.'
          );
        }
      },
      error: (err) => {
        console.error('Ocurrió un error al cargar los datos del usuario:', err);
      },
    });
  }

  activarEdicion() {
    this.modoEdicion = true;

    this.usuarioForm.controls['email'].enable();
    this.usuarioForm.controls['telefono'].enable();
    this.usuarioForm.controls['cobertura'].enable();
    this.usuarioForm.controls['nuevaContraseña'].enable();

    this.usuarioForm.controls['dni'].disable();
  }

  guardarCambios() {
    if (this.usuarioForm.invalid) {
      this.mostrarAlerta('Invalido', 'Por favor, corrige los errores del formulario antes de guardar.')
      return;
    }

    const datosDelFormulario = this.usuarioForm.getRawValue();

    const cambios = {
      nombre: this.nombreUsuario,
      apellido: this.apellidoUsuario,
      dni: this.dniUsuario,
      fecha_nacimiento: this.fechaNacimientoUsuario,
      rol: this.rolUsuario,

      email: datosDelFormulario.email,
      telefono: datosDelFormulario.telefono,
      id_cobertura: datosDelFormulario.cobertura,
      
      ...(datosDelFormulario.nuevaContraseña && {
        password: datosDelFormulario.nuevaContraseña,
      }),
    };
    
    console.log("Objeto enviado al backend (cambios):", cambios);
    
    this.usuarioService.updateUser(cambios, this.userIdNumber).subscribe({
      next: (response) => {
        this.mostrarAlerta('Éxito', 'Cambios guardados con éxito')

        this.modoEdicion = false;
        this.usuarioForm.disable();
        this.cargarDatosUsuario();
      },
      error: (err) => {
        console.error('Error al guardar los cambios:', err);
        this.mostrarAlerta('Error', `Error al guardar los cambios: ${err}`)
      },
    });
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.cargarDatosUsuario();
  }

  volverAtras() {
    this.router.navigate(['/public/home']);
  }

mostrarAlerta(titulo: string, mensaje: string, mostrarCancelar: boolean = false): void {
  
  const datosAlerta: any = {
    titulo: titulo,
    mensaje: mensaje,
    mostrarBotonCancelar: mostrarCancelar
  };

  const dialogRef = this.dialog.open(PopUpComponent, {
    width: '380px', 
    data: datosAlerta 
  });

  dialogRef.afterClosed().subscribe(resultado => {
    if (resultado) {
      console.log('El usuario hizo clic en Aceptar.');
    } else if (resultado === false) {
      console.log('El usuario hizo clic en Cancelar.');
    } else {
      console.log('El diálogo fue cerrado sin seleccionar una acción.');
    }
  });
}
}