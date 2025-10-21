import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
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
    MatCardModule,
  ],
})
export class GestionAgendaComponent implements OnInit {
  datosAgendaMedicos = new MatTableDataSource<any>([]);

  columnasMostradas: string[] = [
    'nombre',
    'especialidad',
    'horario_atencion',
    'acciones',
  ];

  formularioAgenda: FormGroup;
  controlFecha = new FormControl('', [Validators.required]);
  controlHoraEntrada = new FormControl('', [Validators.required]);
  controlHoraSalida = new FormControl('', [Validators.required]);

  fechaSeleccionada: string;

  modoEdicion: boolean = false;
  agendaEnEdicion: any = null;

  constructor(
    private servicioUsuario: UsuarioService,
    private servicioEspecialidad: EspecialidadService,
    private servicioAgenda: AgendaService,
    private enrutador: Router,
    private dialogo: MatDialog
  ) {
    this.fechaSeleccionada = new Date().toISOString().split('T')[0];

    this.formularioAgenda = new FormGroup({
      fecha: this.controlFecha,
      hora_entrada: this.controlHoraEntrada,
      hora_salida: this.controlHoraSalida,
    });
  }

  ngOnInit() {
    this.cargarAgendaMedicos();

    this.controlFecha.valueChanges.subscribe((nuevaFecha) => {
      this.fechaSeleccionada = nuevaFecha
        ? new Date(nuevaFecha).toISOString().split('T')[0]
        : '';
      this.cargarAgendaMedicos();
    });

    this.formularioAgenda.reset(
      {
        fecha: this.fechaSeleccionada,
      },
      { emitEvent: false }
    );
  }

  cargarAgendaMedicos() {
    this.servicioUsuario.getUsers().subscribe({
      next: (respuestaUsuarios: any) => {
        const medicos = (respuestaUsuarios.payload || []).filter(
          (usuario: any) => usuario.rol === 'medico'
        );

        const observablesMedicos: Observable<any>[] = medicos.map(
          (medico: any) => {
            const obsEspecialidad$ = this.servicioEspecialidad
              .obtenerEspecialidadesMedico(medico.id)
              .pipe(
                map((res: any) =>
                  res.payload && res.payload.length > 0
                    ? res.payload[0].descripcion
                    : 'No Asignada'
                ),
                catchError(() => of('No Asignada'))
              );

            const obsAgenda$ = this.servicioAgenda.obtenerAgenda(medico.id).pipe(
              map((res: any) => {
                const agendas = res.payload || [];
                const agendaDelDia = agendas.find(
                  (a: any) =>
                    new Date(a.fecha).toISOString().split('T')[0] ===
                    this.fechaSeleccionada
                );
                return {
                  horario: agendaDelDia
                    ? `${agendaDelDia.hora_entrada} - ${agendaDelDia.hora_salida}`
                    : 'No disponible',
                  agenda_id: agendaDelDia ? agendaDelDia.id : null,
                  hora_entrada_actual: agendaDelDia
                    ? agendaDelDia.hora_entrada
                    : '',
                  hora_salida_actual: agendaDelDia
                    ? agendaDelDia.hora_salida
                    : '',
                  id_especialidad: agendaDelDia
                    ? agendaDelDia.id_especialidad
                    : null,
                };
              }),
              catchError(() => of({ horario: 'Error', agenda_id: null }))
            );

            return forkJoin({
              especialidad: obsEspecialidad$,
              agenda: obsAgenda$,
            }).pipe(
              map((resultados: any) => ({
                id_medico: medico.id,
                nombre: medico.nombre,
                apellido: medico.apellido,
                especialidad: resultados.especialidad,
                horario_atencion: resultados.agenda.horario,
                agenda_id: resultados.agenda.agenda_id,
                hora_entrada_actual: resultados.agenda.hora_entrada_actual,
                hora_salida_actual: resultados.agenda.hora_salida_actual,
                id_especialidad: resultados.agenda.id_especialidad,
              }))
            );
          }
        );

        if (observablesMedicos.length > 0) {
          forkJoin(observablesMedicos).subscribe({
            next: (medicosConAgenda: any[]) => {
              this.datosAgendaMedicos.data = medicosConAgenda;
            },
            error: (error) =>
              console.error('Error al combinar datos de médicos:', error),
          });
        } else {
          this.datosAgendaMedicos.data = [];
        }
      },
      error: (error) =>
        console.error('Error cargando lista de usuarios:', error),
    });
  }

  aplicarFiltro(evento: Event) {
    const valorFiltro = (evento.target as HTMLInputElement).value;
    this.datosAgendaMedicos.filter = valorFiltro.trim().toLowerCase();
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

    const [hora_entrada, hora_salida] = medico.horario_atencion.split(' - ');

    this.formularioAgenda.patchValue(
      {
        fecha: new Date(this.fechaSeleccionada),
        hora_entrada: hora_entrada || medico.hora_entrada_actual,
        hora_salida: hora_salida || medico.hora_salida_actual,
      },
      { emitEvent: false }
    );
  }

  guardarAgenda(): void {
    if (!this.agendaEnEdicion || !this.formularioAgenda.valid) {
      this.mostrarAlerta(
        'Error de Validación',
        'Por favor, complete todos los campos de horario correctamente.'
      );
      return;
    }

    const valoresFormulario = this.formularioAgenda.getRawValue();
    const idAgenda = this.agendaEnEdicion.agenda_id;

    if (typeof idAgenda !== 'number' || idAgenda <= 0 || isNaN(idAgenda)) {
      this.mostrarAlerta(
        'Error',
        'ID de Agenda inválido. La edición solo aplica a agendas existentes.'
      );
      return;
    }

    const agendaActualizada: any = {
      id_medico: this.agendaEnEdicion.id_medico,
      id_especialidad: this.agendaEnEdicion.id_especialidad,
      hora_entrada: valoresFormulario.hora_entrada,
      hora_salida: valoresFormulario.hora_salida,
      fecha: new Date(valoresFormulario.fecha).toISOString().split('T')[0],
    };

    if (!agendaActualizada.hora_entrada || !agendaActualizada.hora_salida) {
      this.mostrarAlerta(
        'Error',
        'Las horas de entrada y salida no pueden estar vacías.'
      );
      return;
    }

    this.servicioAgenda.modificarAgenda(agendaActualizada, idAgenda).subscribe({
      next: (respuesta: any) => {
        this.mostrarAlerta(
          'Éxito',
          `Horario del Dr. ${this.agendaEnEdicion.apellido} actualizado correctamente.`
        );
        this.cancelarEdicion();
        this.cargarAgendaMedicos();
      },
      error: (error) => {
        this.mostrarAlerta(
          'Error',
          'No se pudo actualizar la agenda. Revise los datos e intente de nuevo.'
        );
        console.error('Error al guardar agenda:', error);
      },
    });
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.agendaEnEdicion = null;

    this.formularioAgenda.reset(
      {
        fecha: this.fechaSeleccionada,
      },
      { emitEvent: false }
    );
  }

  mostrarAlerta(titulo: string, mensaje: string): void {
    this.dialogo.open(PopUpComponent, {
      width: '380px',
      data: { titulo: titulo, mensaje: mensaje, mostrarBotonCancelar: false },
    });
  }

  volverAtras() {
    this.enrutador.navigate(['/public/home']);
  }
}