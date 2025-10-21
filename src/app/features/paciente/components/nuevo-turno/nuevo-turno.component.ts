import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MatDialog } from '@angular/material/dialog';
import { PopUpComponent } from 'src/app/shared/components/pop-up/pop-up.component';

@Component({
  selector: 'app-nuevo-turno',
  standalone: true,
  templateUrl: './nuevo-turno.component.html',
  styleUrls: ['./nuevo-turno.component.css'],
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
  ],
})
export class NuevoTurnoComponent implements OnInit { 
  public especialidades: any[] = [];
  public medicos: any[] = [];
  public pacientes: any[] = []; 
  public isOperatorMode: boolean = this.usuarioService.getUserRol() === 'operador'; 
  public horariosDisponibles: { hora: string; id_agenda: number }[] = [];
  public cobertura: any | null = null;
  public minDate: Date;
  public coberturaUsuario: number | null = null;
  public userId: number = parseInt(this.usuarioService.getUserId() || '0', 10);
  public diasDisponiblesMedico: Set<string> = new Set();
  private pacienteSeleccionadoId: number | null = null;

  form = this.fb.group({
    paciente: [
      { value: null as number | null, disabled: !this.isOperatorMode },
      this.isOperatorMode ? Validators.required : []
    ],
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
      { value: null as { hora: string; id_agenda: number } | null, disabled: true }, 
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
    this.escucharCambiosDelFormulario();
    if (!this.isOperatorMode) {
        this.pacienteSeleccionadoId = this.userId;
        this.cargarCoberturaPaciente(this.userId);
    }
  }

  private cargarDatosIniciales() {
    this.especialidadService.obtenerEspecialidades().subscribe((res: any) => {
      this.especialidades = Array.isArray(res) ? res : res?.payload || [];
    });
    
    if (this.isOperatorMode) {
      this.usuarioService.getUsers().subscribe({ 
        next: (response: any) => {
          this.pacientes = response.payload?.filter((u: any) => u.rol === 'paciente') || [];
          this.form.get('paciente')?.enable();
        },
        error: (err) => {
          console.error('Error al cargar la lista de pacientes:', err);
          this.mostrarAlerta('Error', 'Error al cargar la lista de pacientes.');
        },
      });
    }
  }

  private cargarCoberturaPaciente(idPaciente: number | null) {
      if (!idPaciente) {
          this.coberturaUsuario = null;
          return;
      }
      this.usuarioService.getUser(idPaciente).subscribe({
          next: (response: any) => {
              const usuario = response.payload?.[0];
              this.coberturaUsuario = usuario?.id_cobertura || null;
          },
          error: (err) => {
              console.error('Error al cargar la cobertura del paciente:', err);
              this.coberturaUsuario = null;
          },
      });
  }

  private escucharCambiosDelFormulario() {
    if (this.isOperatorMode) {
        this.form.get('paciente')?.valueChanges.subscribe((idPaciente) => {
            this.pacienteSeleccionadoId = idPaciente;
            this.cargarCoberturaPaciente(idPaciente);
            this.form.get('especialidad')?.reset();
        });
    }

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
      this.diasDisponiblesMedico.clear();

      if (idMedico) {
        this.form.get('fecha')?.enable();
        this.obtenerDiasDisponiblesMedico(idMedico);
      }
    });

    this.form.get('fecha')?.valueChanges.subscribe((fecha) => {
      this.form.get('hora')?.reset();
      this.form.get('hora')?.disable();
      this.horariosDisponibles = [];
      if (fecha) {
        this.cargarHorarios();
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

  private obtenerDiasDisponiblesMedico(medicoId: number) {
    this.agendaService.obtenerAgenda(medicoId).subscribe((res: any) => {
      const agendas = Array.isArray(res) ? res : res?.payload || [];
      this.diasDisponiblesMedico.clear();
      agendas.forEach((a: any) => {
        const fecha = new Date(a.fecha).toISOString().split('T')[0];
        this.diasDisponiblesMedico.add(fecha);
      });
    });
  }

  soloDiasDisponibles = (fecha: Date | null): boolean => {
    if (!fecha) return false;
    const fechaISO = fecha.toISOString().split('T')[0];
    return this.diasDisponiblesMedico.has(fechaISO);
  };

  private cargarHorarios() {
    const medicoId = this.form.get('profesional')?.value;
    const fechaSeleccionada = this.form.get('fecha')?.value;

    if (medicoId && fechaSeleccionada) {
      this.agendaService.obtenerAgenda(medicoId).subscribe((res: any) => {
        const agendas = Array.isArray(res) ? res : res?.payload || [];
        const fechaFiltro = new Date(fechaSeleccionada)
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

        if (this.horariosDisponibles.length > 0) {
          this.form.get('hora')?.enable();
        } else {
          this.form.get('hora')?.disable();
        }
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

  confirmarTurno() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mostrarAlerta('Advertencia', 'Por favor, complete todos los campos obligatorios.', false);
      return;
    }
    
    if (!this.pacienteSeleccionadoId) {
         this.mostrarAlerta('Error', 'Debe seleccionar un paciente.', false);
         return;
    }

    const formValue = this.form.getRawValue();
    const horaSeleccionada = formValue.hora as any;
    
    const body = {
      id_paciente: Number(this.pacienteSeleccionadoId),
      id_agenda: horaSeleccionada.id_agenda,
      fecha: new Date(formValue.fecha!).toISOString().split('T')[0],
      hora: horaSeleccionada.hora,
      nota: formValue.notas || '',
      id_cobertura: this.coberturaUsuario, 
    };

    this.turnosService.asignarTurnoPaciente(body).subscribe({
      next: () => {
        this.mostrarAlerta('Éxito', 'Turno confirmado exitosamente.');
        this.router.navigate(['/public/home']);
      },
      error: (err) => {
        const errorMsg = err.error?.message || `Error al confirmar el turno: ${err.message || 'Error desconocido'}`;
        this.mostrarAlerta('Error', errorMsg);
      },
    });
  }

  cancelar() {
    this.router.navigate(['/public/home']);
  }

  mostrarAlerta(
    titulo: string,
    mensaje: string,
    mostrarCancelar: boolean = false
  ) {
    const datosAlerta: any = {
      titulo: titulo,
      mensaje: mensaje,
      mostrarBotonCancelar: mostrarCancelar,
    };

    const dialogRef = this.dialog.open(PopUpComponent, {
      width: '380px',
      data: datosAlerta,
    });
  }
}
