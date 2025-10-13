import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { TurnosService } from 'src/app/core/services/turnos.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface TurnosElement {
  id: number;
  hora: string;
  nombre: string;
  edad: number
}

@Component({
  selector: 'app-turnos-programados',
  templateUrl: './turnos-programados.component.html',
  styleUrls: ['./turnos-programados.component.css'],
  standalone: true,
  imports: [NgIf, MatTableModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule, MatIconModule, MatDatepickerModule, MatNativeDateModule]
})
export class TurnosProgramadosComponent implements OnInit {

       // LISTAR HORARIOS
      
        datasource = new MatTableDataSource<TurnosElement>([]);
      
        displayedColumns: string[] = ['id', 'hora','nombre', 'edad'];
        dataSource = this.datasource;

        fechaSeleccionada: Date = new Date();

        verNota: boolean = false;
        notaSeleccionada: string = '';
      
        getTurnos(): void {
          let fechaImput = this.dateFormControl.value;
          if (fechaImput) {
            this.fechaSeleccionada = new Date(fechaImput);
          }

          let user = this.usuario.getUserId();

          //  modifica el formato de la fecha del input
          let fechaFormatoModificado: string = '';
          let dateForm = this.fechaSeleccionada;
          if (dateForm) {
            let date = new Date(dateForm);
            let anio = date.getFullYear();
            let mes = String(date.getMonth() + 1).padStart(2, '0'); // se le suma 1
            let dia = String(date.getDate()).padStart(2, '0'); // devuelve día del mes
                    
            fechaFormatoModificado = anio + '-' + mes + '-' + dia;
          }
          
          if (user) {
            const body = {
              id_medico: user,
              fecha: fechaFormatoModificado
          };

          this.turno.obtenerTurnosMedico(body).subscribe({
            next: (data) => {
              const turnosObtenidos: TurnosElement[] = [];
                for (let d of data.payload) {
                  
                  // modifica el formato de la fecha
                  const fechaObjeto = new Date(d.fecha); 
                  let fechaAPI = fechaObjeto.toISOString().split('T')[0];

                  // obtiene edad
                  let fechaNacimiento = new Date(d.fecha_nacimiento);
                  let anioNacimientoPaciente = fechaNacimiento.getFullYear();
                  let anioActual = new Date().getFullYear();
                  let edadPaciente = anioActual - anioNacimientoPaciente;
                  

  
                  let datos = {
                    id: d.id_turno,
                    hora: d.hora,
                    nombre: d.nombre_paciente,
                    edad: edadPaciente,
                    nota: d.nota
                  }
                  
                  if (fechaFormatoModificado === fechaAPI) {
                    turnosObtenidos.push(datos);
                  }
                }

                // ordena los turnos de menor a mayor dependiendo de la hora
                turnosObtenidos.sort((a, b) => {
                  const horaA = a.hora;
                  const horaB = b.hora;

                  if (horaA > horaB) {
                      return 1; 
                  }

                  if (horaA < horaB) {
                      return -1;
                  }

                  return 0;
                });
  
                this.dataSource.data = turnosObtenidos;
              },
              error: (err) => {
                console.error('Error al listar la agenda', err);
              }
            });
          }
        }

        getNota(ver: boolean, nota: string): void {
            this.verNota = ver;
            this.notaSeleccionada = nota;     
            
            setTimeout(() => {
              this.verNota = false;
            }, 4000);
          }
      
        // FILTRO TABLA
        applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        
        this.dataSource.filter = filterValue.trim().toLowerCase();
      }

      // HORARIOS TURNOS
        turnoForm: FormGroup;
      
        dateFormControl = new FormControl('', [Validators.required]);

        constructor(private usuario: UsuarioService,
          private turno: TurnosService
        ) {
          this.turnoForm = new FormGroup({
            fecha: this.dateFormControl,
          })
        }

        ngOnInit(): void {
          this.getTurnos();
          this.turnoForm.reset({
            fecha: this.fechaSeleccionada
          });
        }
      
        matcher = new MyErrorStateMatcher();
}
