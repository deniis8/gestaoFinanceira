import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GastosMensais } from '../models/Gastos-Mensais';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class GastosMensaisService {

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

  getGastosMensais(): Observable<GastosMensais[]>{
    const headers = this.getAuthHeaders();
    return this.http.get<GastosMensais[]>(`${this.baseApiUrl}api/gastosmensais`, { headers });
  }
}
