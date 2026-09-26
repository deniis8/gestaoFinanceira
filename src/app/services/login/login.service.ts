import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Tokens {
  token: string;
  refreshToken: string;
  idUsuario: number;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseApiUrl = environment.baseApiUrl;

  postLogin(loginData: { email: string, senha: string }): Observable<Tokens> {
    return this.http.post<Tokens>(`${this.baseApiUrl}api/auth/login`, loginData).pipe(
      tap(response => {
        if (response?.token && response?.refreshToken) {
          this.storeTokens(response);
        }
      })
    );
  }

  storeTokens(tokens: Tokens): void {
    sessionStorage.setItem('authToken', tokens.token);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('idUsuario', tokens.idUsuario.toString());
  }

  getAuthToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

  getIdUsuario(): string | null {
    return localStorage.getItem('idUsuario');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  estaLogado(): boolean {
    return !!(this.getAuthToken() || this.getRefreshToken());
  }

  refreshToken(): Observable<Tokens> {
    return this.http.post<Tokens>(
      `${this.baseApiUrl}api/auth/refresh`,
      { refreshToken: this.getRefreshToken() },
      { withCredentials: true }
    );
  }

  clearTokens(): void {
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('refreshToken');
  }

  logout(): void {
    this.clearTokens();
    this.router.navigate(['/login']);
  }
}
