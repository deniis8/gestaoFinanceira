import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DetalhamentoGastosCentroCusto } from '../models/Detalhamento-Gastos-Centro-Custo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetalhamentoGastosCentroCustoService {

  private baseApiUrl = environment.baseApiUrl;
  
  constructor(private http: HttpClient) { }

  getAllDetalhamentoGastosCentroMesAno(mesAno?: string, descCC?: string): Observable<DetalhamentoGastosCentroCusto[]>{
    return this.http.get<DetalhamentoGastosCentroCusto[]>(`${this.baseApiUrl}api/detalhamentogastoscentrocustos/descricaoCC?mesAno=${mesAno}&descCC=${descCC}`);
  }
}
