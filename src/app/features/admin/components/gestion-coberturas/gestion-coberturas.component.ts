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
import { CoberturasService } from 'src/app/core/services/coberturas.service';
import { Router } from '@angular/router';
/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface CoberturaElement {
  id: number;
  cobertura: string;
}

@Component({
  selector: 'app-gestion-coberturas',
  templateUrl: './gestion-coberturas.component.html',
  styleUrls: ['./gestion-coberturas.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, NgFor, MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatDividerModule, MatTableModule, MatButtonModule, MatIconModule]
})
export class GestionCoberturasComponent implements OnInit {
  // LISTAR COBERTURAS
    
      datasource = new MatTableDataSource<CoberturaElement>([]);
    
      displayedColumns: string[] = ['id', 'cobertura', 'editar'];
      dataSource = this.datasource;
    
      ngOnInit(): void {
        this.getCoberturas();
      }
    
      getCoberturas(): void {
        this.cobertura.getCoberturas().subscribe({
          next: (data) => {
            const coberturasObtenidas: CoberturaElement[] = [];
    
            for (let d of data.payload) {
              let datos = {
                id: d.id,
                cobertura: d.nombre,
              };
              coberturasObtenidas.push(datos);
            }
            this.datasource.data = coberturasObtenidas;
          },
          error: (err) => {
            console.error('Error al obtener coberturas:', err);
          }
        });
      }
    
      // FILTRO TABLA
      applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    
        // CREAR COBERTURAS
    
        createCoberturaForm: FormGroup;
      
      
        coberturaFormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
      
        matcher = new MyErrorStateMatcher();
    
      constructor(private cobertura: CoberturasService, private router: Router
      ) {
         this.createCoberturaForm = new FormGroup({
          cobertura: this.coberturaFormControl,
        });
      }
    
      crearNuevaCobertura(): void {
        this.buttonUpdate = false;
    
        if (this.createCoberturaForm.valid) {
          const body = {
            nombre: this.coberturaFormControl.value,
          }
    
          this.cobertura.crearCobertura(body).subscribe({
          next: (data) => {
            console.log(data)
            alert('Cobertura creada exitosamente');
    
            this.createCoberturaForm.reset();
    
            this.getCoberturas();
          },
          error: (err) => {
            console.error('Error de creacion:', err);
          }
        });
    
          this.createCoberturaForm.clearValidators();
        } else {
          alert('Error al crear cobertura');
        }
      }
    
      // ACTUALIZAR COBERTURA
      buttonUpdate: boolean = false;
    
      actualizarCobertura(): void {
    
         if (this.createCoberturaForm.valid) {
          const body = {
            nombre: this.coberturaFormControl.value,
          }
    
          let idStr = this.cobertura.getCoberturaUpdate();
    console.log(body);
    
          if (idStr) {
            let id = parseInt(idStr);
            this.cobertura.modificarCobertura(body, id).subscribe({

            });
    
            alert('Cobertura actualizada')
            this.createCoberturaForm.reset();
          }
         }
    
         this.buttonUpdate = false;
         this.getCoberturas();
      }
    
      getCobertura(id: number): number {
        this.cobertura.obtenerCoberturaId(id).subscribe({
          next: (data) => {
            
            let datosCobertura = data.payload;
            console.log(datosCobertura);
            
            this.cobertura.saveCoberturaUpdate(datosCobertura);
    
            this.createCoberturaForm.reset({
              cobertura: datosCobertura.nombre,
            });
    
            this.buttonUpdate = true;
    
            return datosCobertura.id;
          },
          error: (err) => {
            console.error('Error al obtener la cobertura ' + err);  
            alert('Error al obtener la cobertura')
          }
        });
    
        return 0;
      }
      volverAtras() {
    this.router.navigate(['/public/home']);
  }
}
