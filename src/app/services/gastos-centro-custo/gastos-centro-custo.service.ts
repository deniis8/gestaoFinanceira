import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GastosCentroCusto } from '../../models/Gastos-Centro-Custo';
import { Observable } from 'rxjs';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class GastosCentroCustoService {

  private baseApiUrl = environment.baseApiUrl;
  
  constructor(private http: HttpClient, private loginService: LoginService) { }

  //Não consumo mais essa rota
  /*getAllGastosCentroCustos(): Observable<GastosCentroCusto[]>{
    return this.http.get<GastosCentroCusto[]>(`${this.baseApiUrl}api/gastoscentrocustos/data`);
  }*/

  getAllGastosCentroMesAno(mesAno?: string): Observable<GastosCentroCusto[]>{
    const idUsuario = this.loginService.getIdUsuario();
    return this.http.get<GastosCentroCusto[]>(`${this.baseApiUrl}api/gastoscentrocustos/usuario/${idUsuario}/mesano/${mesAno}`);
  }
}
