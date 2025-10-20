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
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { forkJoin, of, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { UsuarioService } from 'src/app/core/services/usuario.service';
import { EspecialidadService } from 'src/app/core/services/especialidad.service';
import { AgendaService } from 'src/app/core/services/agenda.service';
import { PopUpComponent } from 'src/app/shared/components/pop-up/pop-up.component';

/** REUTILIZACIÓN DE CLASE DE ERROR */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-gestion-agenda',
  templateUrl: './gestion-agenda.component.html',
  styleUrls: ['./gestion-agenda.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgIf,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatCardModule
  ]
})
export class GestionAgendaComponent implements OnInit {

  medicosAgendaData = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['nombre', 'especialidad', 'horario_atencion', 'acciones'];

  agendaForm: FormGroup;
  dateFormControl = new FormControl('', [Validators.required]);
  timeStarFormControl = new FormControl('', [Validators.required]);
  timeEndFormControl = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();

  fechaSeleccionada: string;

  modoEdicion: boolean = false;
  agendaEnEdicion: any = null;

  constructor(
    private usuarioService: UsuarioService,
    private especialidadService: EspecialidadService,
    private agendaService: AgendaService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.fechaSeleccionada = new Date().toISOString().split('T')[0];

    this.agendaForm = new FormGroup({
        fecha: this.dateFormControl,
        hora_entrada: this.timeStarFormControl,
        hora_salida: this.timeEndFormControl
    });
  }

  ngOnInit(): void {
    this.cargarAgendaMedicos();
    this.dateFormControl.valueChanges.subscribe((newDate) => {
      this.fechaSeleccionada = newDate ? new Date(newDate).toISOString().split('T')[0] : '';
      this.cargarAgendaMedicos();
    });

    this.agendaForm.reset({
        fecha: this.fechaSeleccionada
    }, { emitEvent: false });
  }

  cargarAgendaMedicos(): void {
    this.usuarioService.getUsers().subscribe({
      next: (usersResponse: any) => {
        const medicos = (usersResponse.payload || []).filter((user: any) => user.rol === 'medico');

        const medicoObservables: Observable<any>[] = medicos.map((medico: any) => {

          const especialidad$ = this.especialidadService.obtenerEspecialidadesMedico(medico.id).pipe(
            map((res: any) => (res.payload && res.payload.length > 0) ? res.payload[0].descripcion : 'No Asignada'),
            catchError(() => of('No Asignada'))
          );

          const agenda$ = this.agendaService.obtenerAgenda(medico.id).pipe(
            map((res: any) => {
              const agendas = res.payload || [];
              const agendaDelDia = agendas.find((a: any) => new Date(a.fecha).toISOString().split('T')[0] === this.fechaSeleccionada);
              return {
                horario: agendaDelDia ? `${agendaDelDia.hora_entrada} - ${agendaDelDia.hora_salida}` : 'No disponible',
                agenda_id: agendaDelDia ? agendaDelDia.id : null,
                hora_entrada_actual: agendaDelDia ? agendaDelDia.hora_entrada : '',
                hora_salida_actual: agendaDelDia ? agendaDelDia.hora_salida : '',
                id_especialidad: agendaDelDia ? agendaDelDia.id_especialidad : null,
              };
            }),
            catchError(() => of({ horario: 'Error', agenda_id: null }))
          );

          return forkJoin({ especialidad: especialidad$, agenda: agenda$ }).pipe(
            map((results: any) => ({
              id_medico: medico.id,
              nombre: medico.nombre,
              apellido: medico.apellido,
              especialidad: results.especialidad,
              horario_atencion: results.agenda.horario,
              agenda_id: results.agenda.agenda_id,
              hora_entrada_actual: results.agenda.hora_entrada_actual,
              hora_salida_actual: results.agenda.hora_salida_actual,
              id_especialidad: results.agenda.id_especialidad,
            }))
          );
        });

        if (medicoObservables.length > 0) {
          forkJoin(medicoObservables).subscribe({
            next: (medicosConAgenda: any[]) => {
              this.medicosAgendaData.data = medicosConAgenda;
            },
            error: (err) => console.error('Error al combinar datos de médicos:', err)
          });
        } else {
          this.medicosAgendaData.data = [];
        }
      },
      error: (err) => console.error('Error cargando lista de usuarios:', err)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.medicosAgendaData.filter = filterValue.trim().toLowerCase();
  }

  modificarAgenda(medico: any): void {
    if (medico.horario_atencion === 'No disponible' || !medico.agenda_id) {
      this.mostrarAlerta(
        'Agenda No Definida',
        `El Dr./Dra. ${medico.apellido} no tiene horarios definidos para el ${this.fechaSeleccionada}. No se puede modificar.`
      );
      return;
    }

    this.agendaEnEdicion = medico;
    this.modoEdicion = true;

    const fechaActual = new Date(this.fechaSeleccionada);

    const hora_entrada = medico.horario_atencion.split(' - ')[0] || medico.hora_entrada_actual;
    const hora_salida = medico.horario_atencion.split(' - ')[1] || medico.hora_salida_actual;

    this.agendaForm.patchValue({
        fecha: fechaActual,
        hora_entrada: hora_entrada,
        hora_salida: hora_salida
    }, { emitEvent: false });
  }

  guardarAgenda(): void {
    if (!this.agendaEnEdicion || !this.agendaForm.valid) {
      this.mostrarAlerta('Error de Validación', 'Por favor, complete todos los campos de horario correctamente.');
      return;
    }

    const formValues = this.agendaForm.getRawValue();
    const agendaId = this.agendaEnEdicion.agenda_id;

    if (typeof agendaId !== 'number' || agendaId <= 0 || isNaN(agendaId)) {
        this.mostrarAlerta('Error', 'ID de Agenda inválido. La edición solo aplica a agendas existentes.');
        return;
    }

    const updatedAgenda: any = {
        id_medico: this.agendaEnEdicion.id_medico,
        id_especialidad: this.agendaEnEdicion.id_especialidad,
        hora_entrada: formValues.hora_entrada,
        hora_salida: formValues.hora_salida,
        fecha: new Date(formValues.fecha).toISOString().split('T')[0]
    };

    if (!updatedAgenda.hora_entrada || !updatedAgenda.hora_salida) {
        this.mostrarAlerta('Error', 'Las horas de entrada y salida no pueden estar vacías.');
        return;
    }

    this.agendaService.modificarAgenda(updatedAgenda, agendaId).subscribe({
        next: (response: any) => {
            this.mostrarAlerta('Éxito', `Horario del Dr. ${this.agendaEnEdicion.apellido} actualizado correctamente.`);
            this.cancelarEdicion();
            window.location.reload();
            this.cargarAgendaMedicos();
        },
        error: (err) => {
            this.mostrarAlerta('Error', 'No se pudo actualizar la agenda. Revise si el ID de especialidad es válido.');
            console.error('Error al guardar agenda:', err);
        }
    });
  }
  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.agendaEnEdicion = null;

    this.agendaForm.reset({
        fecha: this.fechaSeleccionada
    }, { emitEvent: false });
  }

  mostrarAlerta(titulo: string, mensaje: string): void {
    this.dialog.open(PopUpComponent, {
      width: '380px',
      data: { titulo: titulo, mensaje: mensaje, mostrarBotonCancelar: false }
    });
  }

  volverAtras() {
    this.router.navigate(['/public/home']);
  }
}
