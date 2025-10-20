import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';

import { TurnosService } from '../../../../core/services/turnos.service';
import { EspecialidadService } from '../../../../core/services/especialidad.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { AgendaService } from '../../../../core/services/agenda.service';
import { PopUpComponent } from 'src/app/shared/components/pop-up/pop-up.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";


@Component({
  selector: 'app-asignar-turno',
  standalone: true,
  templateUrl: './asignar-turno.component.html',
  styleUrls: ['../../../paciente/components/nuevo-turno/nuevo-turno.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatIconModule
],
})
export class AsignarTurnoComponent implements OnInit {

  public especialidades: any[] = [];
  public medicos: any[] = [];
  public pacientes: any[] = [];
  public horariosDisponibles: { hora: string; id_agenda: number }[] = [];
  public cobertura: any | null = null;
  public minDate: Date;
  public coberturaUsuario: number | null = null;

  public userId: number = parseInt(this.usuarioService.getUserId() || '0', 10);

  form = this.fb.group({
    id_paciente: [null as number | null, Validators.required],
    especialidad: [null as number | null, Validators.required],
    profesional: [
      { value: null as number | null, disabled: true },
      Validators.required,
    ],
    fecha: [
      { value: null as Date | null, disabled: true },
      Validators.required,
    ],
    hora: [
      { value: null as string | null, disabled: true },
      Validators.required,
    ],
    notas: [{ value: '', disabled: true }, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private turnosService: TurnosService,
    private especialidadService: EspecialidadService,
    private usuarioService: UsuarioService,
    private agendaService: AgendaService,
    private dialog: MatDialog
  ) {
    this.minDate = new Date();
  }

  ngOnInit() {
    this.cargarDatosIniciales();
    this.cargarPacientes();
    this.escucharCambiosDelFormulario();
  }

  private cargarPacientes() {
    this.usuarioService.getUsers().subscribe((res: any) => {
        this.pacientes = (res.payload || []).filter((u: any) => u.rol === 'paciente');
    });
  }

  private cargarDatosIniciales() {
    this.especialidadService.obtenerEspecialidades().subscribe((res: any) => {

      if (Array.isArray(res)) {
        this.especialidades = res;
      } else {
        this.especialidades = res?.payload || [];
      }
    });

  }

  private escucharCambiosDelFormulario() {
    this.form.get('especialidad')?.valueChanges.subscribe((idEspecialidad) => {
      this.form.get('profesional')?.reset();
      this.form.get('profesional')?.disable();
      this.medicos = [];
      if (idEspecialidad) {
        this.cargarMedicos(idEspecialidad);
      }
    });

    this.form.get('profesional')?.valueChanges.subscribe((idMedico) => {
      this.form.get('fecha')?.reset();
      this.form.get('fecha')?.disable();
      if (idMedico) {
        this.form.get('fecha')?.enable();
      }
    });

    this.form.get('fecha')?.valueChanges.subscribe((fecha) => {
      this.form.get('hora')?.reset();
      this.form.get('hora')?.disable();
      this.horariosDisponibles = [];
      if (fecha) {
        this.cargarHorarios();
        this.form.get('hora')?.enable();
      }
    });

    this.form.get('hora')?.valueChanges.subscribe((hora) => {
      const notasControl = this.form.get('notas');
      if (hora) {
        notasControl?.enable();
      } else {
        notasControl?.disable();
      }
    });
  }

  private cargarMedicos(id: number) {
    this.especialidadService
      .obtenerMedicoPorEspecialidad(id)
      .subscribe((res: any) => {
        const medicosData = Array.isArray(res) ? res : res?.payload;
        this.medicos = medicosData || [];
        if (this.medicos.length > 0) {
          this.form.get('profesional')?.enable();
        }
      });
  }
  private cargarHorarios() {
    const medicoId = this.form.get('profesional')?.value;
    const fechaSeleccionada = this.form.get('fecha')?.value;

    if (medicoId && fechaSeleccionada) {
      this.agendaService.obtenerAgenda(medicoId).subscribe((res: any) => {
        const agendas = Array.isArray(res) ? res : res?.payload || [];
        const fechaFiltro = new Date(fechaSeleccionada!)
          .toISOString()
          .split('T')[0];
        this.horariosDisponibles = [];

        agendas.forEach((agenda: any) => {
          const agendaFecha = new Date(agenda.fecha)
            .toISOString()
            .split('T')[0];
          if (agendaFecha === fechaFiltro) {
            const horariosPorAgenda = this.generarHorariosEntre(
              agenda.hora_entrada,
              agenda.hora_salida
            );
            horariosPorAgenda.forEach((hora) => {
              this.horariosDisponibles.push({
                hora: hora,
                id_agenda: agenda.id,
              });
            });
          }
        });

        this.turnosService.obtenerTurnosMedico({id_medico: medicoId, fecha: fechaFiltro}).subscribe((turnosOcupados: any) => {
          const horasOcupadas = (turnosOcupados.payload || []).map((t: any) => t.hora);

          this.horariosDisponibles = this.horariosDisponibles.filter(
            (horario) => !horasOcupadas.includes(horario.hora)
          );

          if (this.horariosDisponibles.length > 0) {
            this.form.get('hora')?.enable();
          }
        });

      });
    }
  }
  private generarHorariosEntre(horaInicio: string, horaFin: string) {
    const horarios: string[] = [];

    const [hInicio, mInicio] = horaInicio.split(':').map(Number);
    const [hFin, mFin] = horaFin.split(':').map(Number);

    let currentH = hInicio;
    let currentM = mInicio;

    while (currentH < hFin || (currentH === hFin && currentM < mFin)) {
      const horaFormateada = `${this.dosDigitos(currentH)}:${this.dosDigitos(
        currentM
      )}`;
      horarios.push(horaFormateada);
      currentM += 30;
      if (currentM >= 60) {
        currentM -= 60;
        currentH += 1;
      }
    }

    return horarios;
  }

  private dosDigitos(num: number) {
    return num < 10 ? `0${num}` : `${num}`;
  }

  private obtenerCoberturaPaciente(pacienteId: number | null): number | null {
    if (!pacienteId) return null;
    const paciente = this.pacientes.find(p => p.id === pacienteId);
    return paciente ? paciente.id_cobertura : null;
  }

  confirmarTurno(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const idPaciente = formValue.id_paciente;
    const coberturaPaciente = this.obtenerCoberturaPaciente(idPaciente);

    const horaSeleccionada = formValue.hora as any;
    const body = {
      id_paciente: Number(idPaciente),
      id_agenda: horaSeleccionada.id_agenda,
      fecha: new Date(formValue.fecha!).toISOString().split('T')[0],
      hora: horaSeleccionada.hora,
      nota: formValue.notas || '',
      id_cobertura: coberturaPaciente,
    };

    this.turnosService.asignarTurnoPaciente(body).subscribe({
      next: () => {
        this.mostrarAlerta('Exito', 'Turno asignado y confirmado exitosamente.')
        this.router.navigate(['/public/home']);
      },
      error: (err) => {
        this.mostrarAlerta('Error', `Error al confirmar el turno: ${err.message || 'Error de conexión'}`)
      },
    });
  }

  cancelar() {
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
  volverAtras() {
    this.router.navigate(['/public/home']);
  }
}
