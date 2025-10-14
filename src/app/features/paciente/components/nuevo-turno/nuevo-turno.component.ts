import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, switchMap, takeUntil, filter } from 'rxjs/operators';

// Modulos de Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';

// Servicios
import { TurnosService } from '../../../../core/services/turnos.service';
import { EspecialidadService } from '../../../../core/services/especialidad.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { AgendaService } from '../../../../core/services/agenda.service';

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
export class NuevoTurnoComponent {
  public especialidades: any[] = [];
  public medicos: any[] = [];
  public horariosDisponibles: { hora: string; id_agenda: number }[] = [];
  public cobertura: any | null = null;
  public minDate: Date;
  public coberturaUsuario: number | null = null;
  public userId: number = parseInt(this.usuarioService.getUserId() || '0', 10);

  form = this.fb.group({
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
    private agendaService: AgendaService
  ) {
    this.minDate = new Date();
  }

  ngOnInit(): void {
    this.cargarDatosIniciales();
    this.escucharCambiosDelFormulario();
  }

  private cargarDatosIniciales(): void {
    this.especialidadService.obtenerEspecialidades().subscribe((res: any) => {
      console.log('Respuesta completa de especialidades:', res);
      if (Array.isArray(res)) {
        this.especialidades = res;
      } else {
        this.especialidades = res?.payload || [];
      }
    });

    if (this.userId) {
      console.log('Cargando datos para el usuario con ID:', this.userId);
      this.usuarioService.getUser(this.userId).subscribe({
        next: (response: any) => {
          const datosUsuarioArray = response.payload;
          if (
            datosUsuarioArray &&
            Array.isArray(datosUsuarioArray) &&
            datosUsuarioArray.length > 0
          ) {
            const usuario = datosUsuarioArray[0];
            this.coberturaUsuario = usuario.id_cobertura;
          } else {
            console.error(
              'No se encontró el usuario o la estructura de la respuesta es incorrecta.'
            );
          }
        },
        error: (err) => {
          console.error(
            'Ocurrió un error al cargar los datos del usuario:',
            err
          );
        },
      });
    }
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

  private cargarMedicos(id: number): void {
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
  private cargarHorarios(): void {
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
        }
      });
    }
  }
  private generarHorariosEntre(horaInicio: string, horaFin: string): string[] {
    const horarios: string[] = [];

    const [hInicio, mInicio] = horaInicio.split(':').map(Number);
    const [hFin, mFin] = horaFin.split(':').map(Number);

    let currentH = hInicio;
    let currentM = mInicio;

    while (currentH < hFin || (currentH === hFin && currentM <= mFin)) {
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

  private dosDigitos(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  confirmarTurno(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const userId = this.usuarioService.getUserId();

    // El valor de 'hora' ahora es un objeto {hora: string, id_agenda: number}
    // o el id_agenda directamente, dependiendo de tu HTML.
    // Asumamos que guardaste el objeto.
    const horaSeleccionada = formValue.hora as any;

    // ESTE ES EL BODY CORRECTO PARA TU BASE DE DATOS
    const body = {
      id_paciente: Number(userId),
      id_agenda: horaSeleccionada.id_agenda, // <-- El dato clave que faltaba
      fecha: new Date(formValue.fecha!).toISOString().split('T')[0],
      hora: horaSeleccionada.hora, // <-- La hora del objeto
      nota: formValue.notas || '',
      id_cobertura: this.coberturaUsuario,
    };

    console.log('Cuerpo de la solicitud de turno (CORREGIDO):', body);

    this.turnosService.asignarTurnoPaciente(body).subscribe({
      next: () => {
        console.log('Turno confirmado exitosamente.');
        this.router.navigate(['/public/home']);
      },
      error: (err) => {
        console.error('Error al confirmar el turno:', err);
        // Aquí podrías mostrar un mensaje de error al usuario
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/public/home']);
  }
}
