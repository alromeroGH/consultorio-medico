import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:4000/api/login';
  private registerUrl = 'http://localhost:4000/api/crearUsuario';

  constructor(private http: HttpClient,
    private router: Router
  ) { }

  login(body: any): Observable<any> {
    return this.http.post(this.loginUrl, body);
  }

  register(body: any): Observable<any> {
    return this.http.post(this.registerUrl, body)
  }

  saveToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
  }

  redirectToHome() {
    this.router.navigate(['/public/home']);
  }
}
