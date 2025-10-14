import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TurnosService } from 'src/app/core/services/turnos.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { map, Observable } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.css'],
  providers: [DatePipe]
})
export class MisTurnosComponent implements OnInit {
  public idUsuario = this.usuarioService.getUserId();
  public turnos$: Observable<any[]> = this.turnosService.getTurno(Number(this.idUsuario)).pipe(
    map(response => (response.payload || []).sort((a: any, b: any) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()))
  );
  public turnoSeleccionado: any | null = null;

  constructor(
    private turnosService: TurnosService,
    private usuarioService: UsuarioService,
    private datePipe: DatePipe,
    private router: Router
  ) {}

  ngOnInit() {
    this.turnos$.subscribe(data => {
      console.log('✅ Datos de turnos recibidos:', data);
    });
    console.log(this.turnos$);
    console.log(this.idUsuario);
  }

  mostrarDetalles(turno: any) {
    if (this.turnoSeleccionado === turno) {
      this.turnoSeleccionado = null;
    } else {
      this.turnoSeleccionado = turno;
    }
  }

  formatearFechaDetallada(fecha: string) {
    const date = new Date(fecha);
    return this.datePipe.transform(date, 'EEEE d \'de\' MMMM \'de\' yyyy \'a las\' HH:mm \'horas\'');
  }
  volverAtras() {
    this.router.navigate(['/public/home']);
  }
}