import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GastosCentroCusto } from '../models/Gastos-Centro-Custo';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class GastosCentroCustoService {

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

  //Não consumo mais essa rota
  /*getAllGastosCentroCustos(): Observable<GastosCentroCusto[]>{
    return this.http.get<GastosCentroCusto[]>(`${this.baseApiUrl}api/gastoscentrocustos/data`);
  }*/

  getAllGastosCentroMesAno(mesAno?: string): Observable<GastosCentroCusto[]>{
    const headers = this.getAuthHeaders();
    return this.http.get<GastosCentroCusto[]>(`${this.baseApiUrl}api/gastoscentrocustos/mesano/${mesAno}`, { headers });
  }
}
