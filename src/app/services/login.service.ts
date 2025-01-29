import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  postLogin(loginData: { email: string, senha: string }): Observable<any> {
    // Verificando os dados para enviar no console
    console.log(loginData);

    return this.http.post<any>(`${this.baseApiUrl}api/auth/login`, loginData);
  }

  // Método para armazenar o token e o refresh token
  storeTokens(tokens: { token: string, refreshToken: string }) {
    localStorage.setItem('authToken', tokens.token);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  // Método para obter o token do localStorage
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Método para obter o refreshToken do localStorage
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Método para limpar os tokens (logout)
  clearTokens() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }
}
