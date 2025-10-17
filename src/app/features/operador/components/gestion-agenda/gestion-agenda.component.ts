import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; 
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; 
import { Router } from '@angular/router';

import { AgendaService } from 'src/app/core/services/agenda.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { EspecialidadService } from 'src/app/core/services/especialidad.service';
import { PopUpComponent } from 'src/app/shared/components/pop-up/pop-up.component'; 
import { forkJoin, of, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-gestion-agenda',
  templateUrl: './gestion-agenda.component.html',
  styleUrls: ['../../../../features/medico/components/gestion-agenda/gestion-agenda.component.css'], 
  standalone: true, 
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule 
  ]
})
export class GestionAgendaComponent implements OnInit {

  medicosAgendaData = new MatTableDataSource<any>([]); // Usando 'any'
  displayedColumns: string[] = ['nombre', 'especialidad', 'horario_atencion', 'acciones'];
  
  fechaForm: FormGroup;
  fechaSeleccionada: string;

  constructor(
    private agendaService: AgendaService,
    private usuarioService: UsuarioService,
    private especialidadService: EspecialidadService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.fechaSeleccionada = new Date().toISOString().split('T')[0];
    this.fechaForm = new FormGroup({
      fecha: new FormControl(this.fechaSeleccionada, Validators.required)
    });
  }

  ngOnInit(): void {
    this.cargarAgendaMedicos();
    this.fechaForm.get('fecha')?.valueChanges.subscribe((newDate) => {
      this.fechaSeleccionada = newDate ? new Date(newDate).toISOString().split('T')[0] : '';
      this.cargarAgendaMedicos();
    });
  }

  cargarAgendaMedicos(): void {
    this.usuarioService.getUsers().subscribe({
      next: (usersResponse: any) => { // Usando 'any'
        const allUsers = usersResponse.payload || [];
        const medicos = allUsers.filter((user: any) => user.rol === 'medico');
        
        // El array de observables usa un tipo genérico 'any'
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
              };
            }),
            catchError(() => of({ horario: 'Error', agenda_id: null }))
          );

          return forkJoin({ especialidad: especialidad$, agenda: agenda$ }).pipe(
            map(results => ({
              id_medico: medico.id,
              nombre: medico.nombre,
              apellido: medico.apellido,
              especialidad: results.especialidad,
              horario_atencion: results.agenda.horario,
              agenda_id: results.agenda.agenda_id,
            }))
          );
        });

        if (medicoObservables.length > 0) {
          forkJoin(medicoObservables).subscribe({
            next: (medicosConAgenda: any[]) => { // Usando 'any[]'
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

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.medicosAgendaData.filter = filterValue.trim().toLowerCase();
  }

  asignarTurno(medico: any): void { // Usando 'any'
    if (!medico.agenda_id) {
        this.mostrarAlerta('Agenda no disponible', 'El médico no tiene un horario definido para la fecha seleccionada. No se puede asignar turno.');
        return;
    }
    // Redirección al componente de creación de turno (se asume que existe NuevoTurnoComponent)
    alert(`Redirigiendo para asignar turno para ${medico.nombre} ${medico.apellido} el ${this.fechaSeleccionada}`);
    this.router.navigate(['/paciente/nuevo-turno'], { 
      queryParams: { medicoId: medico.id_medico, fecha: this.fechaSeleccionada } 
    });
  }

  verTurnos(medico: any): void { // Usando 'any'
    // Redirecciona a la lista de pacientes del día con filtro por médico
    this.router.navigate(['/operador/pacientes-del-dia'], { 
      queryParams: { 
        medicoId: medico.id_medico, 
        fecha: this.fechaSeleccionada 
      } 
    });
  }

  modificarAgenda(medico: any): void { // Usando 'any'
    if (!medico.agenda_id) {
        this.mostrarAlerta('Agenda no definida', 'El médico no tiene una agenda definida para este día.');
        return;
    }
    this.mostrarAlerta(
      'Edición de Agenda (Rol Operador)',
      `El operador puede modificar el rango de horarios para el Dr./Dra. ${medico.apellido} o administrar sus turnos individuales para el día ${this.fechaSeleccionada}.`
    );
  }

  mostrarAlerta(titulo: string, mensaje: string): void {
    this.dialog.open(PopUpComponent, {
      width: '380px',
      data: { titulo: titulo, mensaje: mensaje, mostrarBotonCancelar: false }
    });
  }
}