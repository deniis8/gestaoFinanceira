import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { avisarFalha } from 'src/app/core/http';
import { AnaliseFinanceiraIaRequest, AnaliseFinanceiraIaResponse, ConfiguracoesIA } from 'src/types';
import { LoginService } from '../login/login.service';
import { MensagensService } from '../mensagens/mensagens.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracoesIaService {
  private http = inject(HttpClient);
  private login = inject(LoginService);
  private mensagens = inject(MensagensService);
  private baseApiUrl = environment.baseApiUrl;

  getConfiguracaoIA(): Observable<ConfiguracoesIA> {
    return this.http.get<ConfiguracoesIA>(`${this.baseApiUrl}api/configuracoesia/usuario/${this.login.getIdUsuario()}`).pipe(
      avisarFalha(this.mensagens, 'carregar as configurações da IA')
    );
  }

  putConfiguracaoIA(payload: ConfiguracoesIA, id: number): Observable<void> {
    return this.http.put<void>(`${this.baseApiUrl}api/configuracoesia/${id}`, { ...payload, id }).pipe(
      avisarFalha(this.mensagens, 'salvar as configurações da IA')
    );
  }

  postAnaliseFinanceiraIa(dataDe: string, dataAte: string, textoAuxiliar: string): Observable<AnaliseFinanceiraIaResponse> {
    const body: AnaliseFinanceiraIaRequest = {
      idUsuario: Number(this.login.getIdUsuario()),
      dataDe,
      dataAte,
      textoAuxiliar
    };

    return this.http.post<AnaliseFinanceiraIaResponse>(`${this.baseApiUrl}api/analisefinanceiraia`, body).pipe(
      avisarFalha(this.mensagens, 'gerar a análise com IA')
    );
  }
}
