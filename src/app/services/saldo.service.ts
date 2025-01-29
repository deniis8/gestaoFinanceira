import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Saldo } from '../models/Saldo';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class SaldoService {
  private baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient, private loginService: LoginService) { }

   // Método para obter o token de autenticação
   private getAuthHeaders() {
    const token = this.loginService.getAuthToken(); // Obtendo o token armazenado
    if (!token) {
      throw new Error('Token não encontrado');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getSaldos(): Observable<Saldo>{
    const headers = this.getAuthHeaders();
    return this.http.get<Saldo>(`${this.baseApiUrl}api/saldosinvestimentos`, { headers });
  }
}
