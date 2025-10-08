import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {
  private turnoUrl = 'http://localhost:4000/api/obtenerTurnoPaciente/';
  private turnoMedicoUrl = 'http://localhost:4000/api/obtenerTurnosMedico';
  private asignarTurnoUrl = 'http://localhost:4000/api/asignarTurnoPaciente';
  private actualizarTurnoUrl = 'http://localhost:4000/api/actualizarTurnoPaciente/';
  private eliminarTurnoUrl = 'http://localhost:4000/api/eliminarTurnoPaciente/';

  constructor(private http: HttpClient) { }

  getTurno(id: number): Observable<any> {
    return this.http.get(this.turnoUrl + id);
  }

  obtenerTurnosMedico(body: any): Observable<any> {
    return this.http.post(this.turnoMedicoUrl, body);
  }

  asignarTurnoPaciente(body: any): Observable<any> {
    return this.http.post(this.asignarTurnoUrl, body);
  }

  actualizarTurnoPaciente(body: any, id: number):  Observable<any> {
    return this.http.put(this.actualizarTurnoUrl + id, body);
  }

  eliminarTurnoPaciente(id: number): Observable<any> {
    return this.http.delete(this.eliminarTurnoUrl + id)
  }
}
