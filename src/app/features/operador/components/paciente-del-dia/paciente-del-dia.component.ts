import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TurnosService } from 'src/app/core/services/turnos.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-pacientes-del_dia',
  standalone: true,
  templateUrl: './paciente-del-dia.component.html',
  styleUrls: [
    './paciente-del-dia.component.css',
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class PacienteDelDiaComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['hora', 'nombre_paciente', 'dni_paciente', 'nombre_medico', 'especialidad', 'nota'];
  fechaFormControl = new FormControl<string>(this.formatDateToISO(new Date()));
  medicoIdFiltro: number | null = null; 
  verNota = false;
  notaSeleccionada = '';
  
  private idUsuarioLogueado: number | null = null; 
  private rolUsuario: string | null = null; 

  constructor(
    private turnosService: TurnosService,
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService 
  ) {}

  private formatDateToISO(date: Date | string){
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); 
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  ngOnInit() {
    const idString = this.usuarioService.getUserId();
    this.idUsuarioLogueado = idString ? parseInt(idString, 10) : null;
    this.rolUsuario = this.usuarioService.getUserRol(); 
    this.route.queryParams.subscribe(params => {
      const initialDate = params['fecha'] ? this.formatDateToISO(params['fecha']) : this.fechaFormControl.value!;
      this.fechaFormControl.setValue(initialDate); 
      
      const medicoIdParam = params['medicoId'];
      if (medicoIdParam) {
          this.medicoIdFiltro = parseInt(medicoIdParam, 10);
      } else if (this.rolUsuario === 'medico') {
          this.medicoIdFiltro = this.idUsuarioLogueado;
      } else {
          this.medicoIdFiltro = null;
      }
      
      this.cargarTurnosDelDia();
    });

    this.fechaFormControl.valueChanges.subscribe((value: any) => { 
        if (value instanceof Date) { 
            this.fechaFormControl.setValue(this.formatDateToISO(value), { emitEvent: false });
        }
        this.cargarTurnosDelDia();
    });
  }

  cargarTurnosDelDia() {
    const fecha = this.fechaFormControl.value;
    
    if (!fecha) {
        this.dataSource.data = [];
        return;
    }
    let body: any = { fecha }; 

    if (this.medicoIdFiltro !== null) {
        body.id_medico = this.medicoIdFiltro;
    }
    
    this.turnosService.obtenerTurnosMedico(body).subscribe({
      next: (response: any) => { 
        let payload = response.payload || response;
        if (!Array.isArray(payload)) {
             payload = []; 
        }
        
        const turnos = payload
          .filter((t: any) => {
             return true; 
          })
          .map((t: any) => ({
            id: t.id_turno || t.id,
            hora: t.hora,
            nombre_paciente: t.nombre_paciente, 
            dni_paciente: t.dni_paciente || t.dni, 
            edad: new Date().getFullYear() - new Date(t.fecha_nacimiento_paciente || t.fecha_nacimiento).getFullYear(), 
            nombre_medico: t.nombre_medico, 
            especialidad: t.especialidad, 
            nota: t.nota,
          }))
          .sort((a: any, b: any) => a.hora.localeCompare(b.hora));

        this.dataSource.data = turnos;
      },
      error: err => {
        console.error('Error al listar turnos:', err);
        this.dataSource.data = [];
      },
    });
  }

  aplicarFiltro(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  getNota(nota: string) {
    this.verNota = true;
    this.notaSeleccionada = nota;
    setTimeout(() => (this.verNota = false), 4000);
  }

  volverAtras() {
    this.router.navigate(['/public/home']);
  }
}
