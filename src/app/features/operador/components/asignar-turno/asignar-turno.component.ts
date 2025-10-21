import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NuevoTurnoComponent } from '../../../paciente/components/nuevo-turno/nuevo-turno.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-crear-turno',
  standalone: true,
  templateUrl: './asignar-turno.component.html',
  styleUrls: [
    '../../../paciente/components/nuevo-turno/nuevo-turno.component.css',
  ],
  imports: [CommonModule, MatCardModule, NuevoTurnoComponent],
})
export class AsignarTurnoComponent {
  constructor() {}
}
