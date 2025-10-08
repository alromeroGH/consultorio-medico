import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private obtenerAgendaUrl = 'http://localhost:4000/api/obtenerAgenda/';
  private crearAgendaUrl = 'http://localhost:4000/api/crearAgenda';
  private modificarAgendaUrl = 'http://localhost:4000/api/modificarAgenda/';

  constructor(private http: HttpClient) { }

  obtenerAgenda(idMedico: number): Observable<any> {
    return this.http.get(this.obtenerAgendaUrl + idMedico);
  }

  crearAgenda(body: any): Observable<any> {
    return this.http.post(this.crearAgendaUrl, body);
  }

  modificarAgenda( body: any, idAgenda: number): Observable<any> {
    return this.http.put(this.modificarAgendaUrl + idAgenda, body);
  }
}
