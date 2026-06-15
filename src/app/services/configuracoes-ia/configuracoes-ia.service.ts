import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AnaliseFinanceiraIaResponse, ConfiguracoesIA } from 'src/types';
import { LoginService } from '../login/login.service';
import { MensagensService } from '../mensagens/mensagens.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracoesIaService {

  private baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient, private loginService: LoginService, private mensagensService: MensagensService) { }

  getConfiguracaoIA(): Observable<ConfiguracoesIA> {
    const idUsuario = this.loginService.getIdUsuario();
    return this.http.get<ConfiguracoesIA>(`${this.baseApiUrl}api/configuracoesia/usuario/${idUsuario}`).pipe(
      catchError(error => {
        this.mensagensService.mensagem('error', 'Erro', `Erro ao buscar configurações IA: ${error.status}`, undefined);
        return throwError(error);
      })
    );
  }

  putConfiguracaoIA(payload: ConfiguracoesIA, id: number): Observable<void> {

    return this.http.put<void>(
      `${this.baseApiUrl}api/configuracoesia/${id}`,
      {
        ...payload,
        id
      }
    ).pipe(
      catchError(error => {
        this.mensagensService.mensagem('error', 'Erro', `Erro ao atualizar configurações IA: ${error.status}`, undefined);
        return throwError(error);
      })
    );
  }

  postAnaliseFinanceiraIa(
    dataDe: string,
    dataAte: string,
    textoAuxiliar: string
  ): Observable<AnaliseFinanceiraIaResponse> {

    const body = {
      idUsuario: Number(this.loginService.getIdUsuario()),
      dataDe,
      dataAte,
      textoAuxiliar
    };

    return this.http.post<AnaliseFinanceiraIaResponse>(
      `${this.baseApiUrl}api/analisefinanceiraia`,
      body
    ).pipe(
      catchError(error => {
        this.mensagensService.mensagem('error', 'Erro', `Erro ao analisar finanças com IA: ${error.status}`, undefined);
        return throwError(error);
      })
    );
  }
}
