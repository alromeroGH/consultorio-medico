import { Component } from '@angular/core';
import { RegisterComponent } from '../../../auth/components/register/register.component';
@Component({
  selector: 'app-crear-paciente',
  standalone: true,
  imports: [
    RegisterComponent
  ],
  templateUrl: './crear-paciente.component.html',
  styleUrls: ['../../../auth/components/register/register.component.css']
})
export class CrearPacienteComponent {
}
