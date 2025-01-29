import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DetalhamentoGastosCentroCusto } from '../models/Detalhamento-Gastos-Centro-Custo';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class DetalhamentoGastosCentroCustoService {

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

  getAllDetalhamentoGastosCentroMesAno(mesAno?: string, descCC?: string): Observable<DetalhamentoGastosCentroCusto[]>{
    const headers = this.getAuthHeaders();
    return this.http.get<DetalhamentoGastosCentroCusto[]>(`${this.baseApiUrl}api/detalhamentogastoscentrocustos/descricaoCC?mesAno=${mesAno}&descCC=${descCC}`, { headers });
  }
}
