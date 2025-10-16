import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

export interface AlertDialogData {
  titulo: string;
  mensaje: string;
  mostrarBotonCancelar?: boolean;
}

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    NgIf
  ],
})
export class PopUpComponent {
  constructor(
    public dialogRef: MatDialogRef<PopUpComponent>,

    @Inject(MAT_DIALOG_DATA) public data: AlertDialogData 
  ) {}
}
