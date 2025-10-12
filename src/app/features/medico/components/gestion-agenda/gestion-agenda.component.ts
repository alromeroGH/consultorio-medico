import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgIf, NgFor, NgStyle } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { EspecialidadService } from 'src/app/core/services/especialidad.service';
import { AgendaService } from 'src/app/core/services/agenda.service';
import { firstValueFrom } from 'rxjs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface AgendaElement {
  id: number;
  hora_entrada: string;
  hora_salida: string;
  fecha: string;
  id_medico: string;
  id_especialidad: string;
}

@Component({
  selector: 'app-gestion-agenda',
  templateUrl: './gestion-agenda.component.html',
  styleUrls: ['./gestion-agenda.component.css'],
  standalone:true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSelectModule, NgIf, NgFor, MatIconModule, MatDatepickerModule, MatNativeDateModule, MatDividerModule, MatButtonModule, NgStyle, MatTableModule]
})
export class GestionAgendaComponent implements OnInit {
  // AGREGAR HORARIOS AGENDA
    agendaForm: FormGroup;

    actualDate: Date = new Date();
    horaInicio: string = '08:00';
    hiraFin: string = '16:00';

    verHorario: boolean = false;

    dateFormControl = new FormControl('', [Validators.required]);

    timeStarFormControl = new FormControl('', [Validators.required]);
    timeEndFormControl = new FormControl('', [Validators.required]);
  
    matcher = new MyErrorStateMatcher();

    constructor(private usuario: UsuarioService,
      private especialidad: EspecialidadService,
      private agenda: AgendaService
    ) {
    
        // se hace el form para validar que todos los campos estén bien
        this.agendaForm = new FormGroup({
          fecha: this.dateFormControl,
          hora_entrada: this.timeStarFormControl,
          hora_salida: this.timeEndFormControl
        });
    }

    ngOnInit(): void {
      this.getAgenda();
      this.agendaForm.reset({
        fecha: this.actualDate,
        hora_entrada: this.horaInicio,
        hora_salida: this.hiraFin
      });
    }

    nuevoHorario(ver: boolean): void {
      this.verHorario = ver;
    }

    async agregarHorario(): Promise<void> {
      let user = this.usuario.getUserId();

      if (this.agendaForm.valid) {
        if (user) {
          this.usuario.getUser(Number(user)).subscribe({
            next: async (data) => {
              let idEspecialidad = await this.obtenerEspecialidad(Number(user));

              const body = {
                hora_entrada: this.timeStarFormControl.value,
                hora_salida: this.timeEndFormControl.value,
                fecha: this.dateFormControl.value,
                id_medico: data.payload[0].id,
                id_especialidad: idEspecialidad
              }

              this.crearAgenda(body);
            },
            error: (err) => {
              console.error('Error al agregar horario', err);
            }
          });
        }
      }
    }

    obtenerEspecialidad(idMedico: number): Promise<number> {
       return firstValueFrom(this.especialidad.obtenerEspecialidadesMedico(idMedico))
       .then(data => {
          if (data.payload && data.payload.length > 0) {
            return data.payload[0].id_especialidad;
          }

          return 0;
       }).catch(err => {
          console.error('Error al obtener especialidad', err);
          return 0;
      });
    }

    crearAgenda(body: any): void {
      this.agenda.crearAgenda(body).subscribe({
         next: (data) => {
           alert('Agenda creada con éxito')
           this.getAgenda();
          },
          error: (err) => {
            console.error('Error al crear agenda', err);
          }
      });
    }

    // LISTAR HORARIOS
    
      datasource = new MatTableDataSource<AgendaElement>([]);
    
      displayedColumns: string[] = ['id', 'hora_entrada','hora_salida', 'fecha', 'id_medico', 'id_especialidad'];
      dataSource = this.datasource;
    
      getAgenda(): void {
        let user = this.usuario.getUserId();
        
        if (user) {
          this.agenda.obtenerAgenda(Number(user)).subscribe({
            next: (data) => {
              const agendasObtenidas: AgendaElement[] = [];

              for (let d of data.payload) {
                // modifica el formato de la fecha
                const fechaObjeto1 = new Date(d.fecha); 
                let fechaAPI = fechaObjeto1.toISOString().split('T')[0];

                let datos = {
                  id: d.id,
                  hora_entrada: d.hora_entrada,
                  hora_salida: d.hora_salida,
                  fecha: fechaAPI,
                  id_medico: d.id_medico,
                  id_especialidad: d.id_especialidad
                }
                
                // modifica el formato de la fecha del input
                let fechaSeleccionada: string = '';
                let dateForm = this.dateFormControl.value;
                if (dateForm) {
                  let date = new Date(dateForm);
                  let anio = date.getFullYear();
                  let mes = String(date.getMonth() + 1).padStart(2, '0'); // se le suma 1
                  let dia = String(date.getDate()).padStart(2, '0'); // devuelve día del mes
                  
                  fechaSeleccionada = anio + '-' + mes + '-' + dia;
                }
                
                if (fechaSeleccionada === fechaAPI) {
                  agendasObtenidas.push(datos);
                }
              }

              this.dataSource.data = agendasObtenidas;
            },
            error: (err) => {
              console.error('Error al listar la agenda', err);
            }
          });
        }
      }
    
      // FILTRO TABLA
      applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}