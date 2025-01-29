import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GastosCentroCusto } from '../models/Gastos-Centro-Custo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GastosCentroCustoService {

  private baseApiUrl = environment.baseApiUrl;
  
  constructor(private http: HttpClient) { }

  //Não consumo mais essa rota
  /*getAllGastosCentroCustos(): Observable<GastosCentroCusto[]>{
    return this.http.get<GastosCentroCusto[]>(`${this.baseApiUrl}api/gastoscentrocustos/data`);
  }*/

  getAllGastosCentroMesAno(mesAno?: string): Observable<GastosCentroCusto[]>{
    return this.http.get<GastosCentroCusto[]>(`${this.baseApiUrl}api/gastoscentrocustos/mesano/${mesAno}`);
  }
}
