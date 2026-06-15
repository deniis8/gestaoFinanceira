import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { LoginService } from '../login/login.service';
import { GastosCentroCusto } from 'src/types';
import { MensagensService } from '../mensagens/mensagens.service';

@Injectable({
  providedIn: 'root'
})
export class GastosCentroCustoService {

  private baseApiUrl = environment.baseApiUrl;
  
  constructor(private http: HttpClient, private loginService: LoginService, private mensagensService: MensagensService  ) { }

  getAllGastosCentroMesAno(mesAno?: string): Observable<GastosCentroCusto[]>{
    const idUsuario = this.loginService.getIdUsuario();
    return this.http.get<GastosCentroCusto[]>(`${this.baseApiUrl}api/gastoscentrocustos/usuario/${idUsuario}/mesano/${mesAno}`).pipe(
      catchError(error => {
        this.mensagensService.mensagem('error', 'Erro', `Erro ao buscar gastos por centro de custo: ${error.status}`, undefined);
        return throwError(error);
      })
    );
  }
}
