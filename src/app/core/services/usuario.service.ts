import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usersUrl = 'http://localhost:4000/api/obtenerUsuarios';
  private userUrl = 'http://localhost:4000/api/obtenerUsuario/';
  private userUpdateUrl = 'http://localhost:4000/api/actualizarUsuario/';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get(this.usersUrl);
  }

  getUser(id: number): Observable<any> {
    return this.http.get(this.userUrl + id)
  }

  updateUser(body: any, id: number): Observable<any> {
    return this.http.put(this.userUpdateUrl + id, body);
  }

  saveUser(user: any): void {
    localStorage.setItem('user_id', user.id);
    localStorage.setItem('user_name', user.nombre);
    localStorage.setItem('user_rol', user.rol);
  }

  getUserId(): string | null {
    return localStorage.getItem('user_id');
  }

  getUserName(): string | null {
    return localStorage.getItem('user_name');
  }

  getUserRol(): string | null {
    return localStorage.getItem('user_rol');
  }

  logout(): void {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_rol');
  }
}
