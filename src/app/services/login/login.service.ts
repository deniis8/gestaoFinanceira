import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap, tap, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  postLogin(loginData: { email: string, senha: string }): Observable<any> {
    console.log(loginData);

    return this.http.post<any>(`${this.baseApiUrl}api/auth/login`, loginData).pipe(
      tap(response => {
        this.storeTokens(response);
      }),
      catchError(error => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: `Erro no login: ${error.status}`
        });
        return throwError(error);
      })
    );
  }

  // Método para armazenar os tokens
  storeTokens(tokens: { token: string, refreshToken: string, idUsuario: Number }) {
    sessionStorage.setItem('authToken', tokens.token);
    localStorage.setItem('refreshToken', tokens.refreshToken); // Armazenando no localStorage
    localStorage.setItem('idUsuario', tokens.idUsuario.toString());
  }

  getAuthToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

  getIdUsuario(): string | null {
    return localStorage.getItem('idUsuario');
  }

  // Método para obter o refreshToken do localStorage
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Método para renovar o token
  refreshToken(): Observable<{ token: string; refreshToken: string; idUsuario: Number }> {
    const refreshToken = this.getRefreshToken(); // Recuperando o refreshToken do localStorage
    return this.http.post<{ token: string; refreshToken: string; idUsuario: Number }>(
      `${this.baseApiUrl}api/auth/refresh`,
      { refreshToken },
      { withCredentials: true } // Permite enviar os cookies automaticamente, se necessário
    ).pipe(
      catchError(error => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: `Erro ao renovar token: ${error.status}`
        });
        return throwError(error);
      })
    );
  }

  clearTokens() {
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('refreshToken'); // Limpa o refreshToken também
  }

  logout() {
    this.clearTokens();
    window.location.href = '/login'; // Redireciona para login
  }

}
