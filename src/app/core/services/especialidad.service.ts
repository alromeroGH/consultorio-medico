import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
  private especialidadesUrl = 'http://localhost:4000/api/obtenerEspecialidades';
  private especialidadesMedicoUrl = 'http://localhost:4000/api/obtenerEspecialidadesMedico/';
  private medicoPorEspecialidadUrl = 'http://localhost:4000/api/obtenerMedicoPorEspecialidad/';
  private crearMedicoEspecialidadUrl = 'http://localhost:4000/api/crearMedicoEspecialidad';

  private crearEspecialidadUrl = 'http://localhost:4000/api/crearEspecialidad';
  private modificarEspecialidadUrl = 'http://localhost:4000/api/modificarEspecialidad/';
  private eliminarEspecialidadUrl = 'http://localhost:4000/api/eliminarEspecialidad/';
  private obtenerEspecialidadIdUrl = 'http://localhost:4000/api/obtenerEspecialidad/';

  constructor(private http: HttpClient) { }

  obtenerEspecialidades(): Observable<any> {
    return this.http.get(this.especialidadesUrl);
  }

  obtenerEspecialidadesMedico(idMedico: number): Observable<any> {
    return this.http.get(this.especialidadesMedicoUrl + idMedico);
  }

  obtenerMedicoPorEspecialidad(idEspecialidad: number): Observable<any> {
    return this.http.get(this.medicoPorEspecialidadUrl + idEspecialidad);
  }

  crearMedicoEspecialidad(body: any): Observable<any> {
    return this.http.post(this.crearMedicoEspecialidadUrl, body);
  }

  crearEspecialidad(body: any): Observable<any> {
    return this.http.post(this.crearEspecialidadUrl, body);
  }

  modificarEspecialidad(body: any, id: number): Observable<any> {
    return this.http.put(this.modificarEspecialidadUrl + id, body);
  }

  eliminarEspecialidad(id: number): Observable<any> {
    return this.http.delete(this.eliminarEspecialidadUrl + id);
  }

  obtenerEspecialidadId(id: number): Observable<any> {
    return this.http.get(this.obtenerEspecialidadIdUrl + id);
  }

  saveEspecialidadUpdate(especialidad: any): void {
    localStorage.setItem('id_especialidad_update', especialidad.id);
  }

  getEspecialidadUpdate(): string | null {
    return localStorage.getItem('id_especialidad_update');
  }
}