import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { LoginService } from '../login/login.service';
import { DetalhamentoGastosCentroCusto } from 'src/types';

@Injectable({
  providedIn: 'root'
})
export class DetalhamentoGastosCentroCustoService {

  private baseApiUrl = environment.baseApiUrl;
  
  constructor(private http: HttpClient, private loginService: LoginService) { }

  getAllDetalhamentoGastosCentroMesAno(mesAno?: string, descCC?: string): Observable<DetalhamentoGastosCentroCusto[]>{
    const idUsuario = this.loginService.getIdUsuario();
    return this.http.get<DetalhamentoGastosCentroCusto[]>(`${this.baseApiUrl}api/detalhamentogastoscentrocustos/descricaoCC?idUsuario=${idUsuario}&mesAno=${mesAno}&descCC=${descCC}`);
  }
}
