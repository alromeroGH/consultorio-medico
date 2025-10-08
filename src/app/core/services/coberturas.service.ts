import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoberturasService {
  private CoberturaUrl = 'http://localhost:4000/api/obtenerCoberturas';

  private crearCoberturaUrl = 'http://localhost:4000/api/crearCobertura';
  private modificarCoberturaUrl = 'http://localhost:4000/api/modificarCobertura/';
  private eliminarCoberturaUrl = 'http://localhost:4000/api/eliminarCobertura/';

  constructor(private http: HttpClient) { }

  getCoberturas(): Observable<any> {
    return this.http.get(this.CoberturaUrl);
  }

  crearCobertura(body: any): Observable<any> {
    return this.http.post(this.crearCoberturaUrl, body);
  }

  modificarCobertura(body: any, id: number): Observable<any> {
    return this.http.put(this.modificarCoberturaUrl + id, body);
  }

  eliminarCobertura(id: number): Observable<any> {
    return this.http.delete(this.eliminarCoberturaUrl + id);
  }
}
