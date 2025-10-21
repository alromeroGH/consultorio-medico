import { Component } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { OnInit } from '@angular/core';
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
import { EspecialidadService } from 'src/app/core/services/especialidad.service';
import { Router } from '@angular/router';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface EspecialidadElement {
  id: number;
  especialidad: string;
}

@Component({
  selector: 'app-gestion-especialidades',
  templateUrl: './gestion-especialidades.component.html',
  styleUrls: ['./gestion-especialidades.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, NgFor, MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatDividerModule, MatTableModule, MatButtonModule, MatIconModule]
})
export class GestionEspecialidadesComponent implements OnInit {
  // LISTAR ESPECIALIDADES
  
    datasource = new MatTableDataSource<EspecialidadElement>([]);
  
    displayedColumns: string[] = ['id', 'especialidad', 'editar'];
    dataSource = this.datasource;
  
    ngOnInit(): void {
      this.getEspecialidades();
    }
  
    getEspecialidades(): void {
      this.especialidad.obtenerEspecialidades().subscribe({
        next: (data) => {
          const especialidadesObtenidas: EspecialidadElement[] = [];
  
          for (let d of data.payload) {
            let datos = {
              id: d.id,
              especialidad: d.descripcion,
            };
            especialidadesObtenidas.push(datos);
          }
          this.datasource.data = especialidadesObtenidas;
        },
        error: (err) => {
          console.error('Error al obtener especialidades:', err);
        }
      });
    }
  
    // FILTRO TABLA
    applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
      // CREAR ESPECIALIDADES
  
      createEspecialidadForm: FormGroup;
    
    
      especialidadFormControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
    
      matcher = new MyErrorStateMatcher();
  
    constructor(private especialidad: EspecialidadService, private router: Router
    ) {
       this.createEspecialidadForm = new FormGroup({
        especialidad: this.especialidadFormControl,
      });
    }
  
    crearNuevaEspecialidad(): void {
      this.buttonUpdate = false;
  
      if (this.createEspecialidadForm.valid) {
        const body = {
          descripcion: this.especialidadFormControl.value,
        }
  
        this.especialidad.crearEspecialidad(body).subscribe({
        next: (data) => {
          console.log(data)
          alert('Especialidad creado exitosamente');
  
          this.createEspecialidadForm.reset();
  
          this.getEspecialidades();
        },
        error: (err) => {
          console.error('Error de creacion:', err);
        }
      });
  
        this.createEspecialidadForm.clearValidators();
      } else {
        alert('Error al crear especialidad');
      }
    }
  
    // ACTUALIZAR ESPECIALIDAD
    buttonUpdate: boolean = false;
  
    actualizarEspecialidad(): void {
  
       if (this.createEspecialidadForm.valid) {
        const body = {
          descripcion: this.especialidadFormControl.value,
        }
  
        let idStr = this.especialidad.getEspecialidadUpdate();
  
        if (idStr) {
          let id = parseInt(idStr);
          this.especialidad.modificarEspecialidad(body, id).subscribe({
            
          });
  
          alert('Especialidad actualizada')
          this.createEspecialidadForm.reset();
        }
       }
  
       this.buttonUpdate = false;
       this.getEspecialidades();
    }
  
    getEspecialidad(id: number): number {
      this.especialidad.obtenerEspecialidadId(id).subscribe({
        next: (data) => {
          
          let datosEspecialidad = data.payload;
          
          this.especialidad.saveEspecialidadUpdate(datosEspecialidad);
  
          this.createEspecialidadForm.reset({
            especialidad: datosEspecialidad.descripcion,
          });
  
          this.buttonUpdate = true;
  
          return datosEspecialidad.id;
        },
        error: (err) => {
          console.error('Error al obtener la especialidad ' + err);  
          alert('Error al obtener la especialidad')
        }
      });
  
      return 0;
    }

    volverAtras() {
    this.router.navigate(['/public/home']);
  }
}