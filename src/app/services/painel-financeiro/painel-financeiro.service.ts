import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { avisarFalha } from 'src/app/core/http';
import { EvolucaoPatrimonio, PainelMes } from 'src/types';
import { LoginService } from '../login/login.service';
import { MensagensService } from '../mensagens/mensagens.service';

@Injectable({
  providedIn: 'root'
})
export class PainelFinanceiroService {
  private http = inject(HttpClient);
  private login = inject(LoginService);
  private mensagens = inject(MensagensService);
  private api = `${environment.baseApiUrl}api/painelfinanceiro`;

  /** Saldo de fechamento mês a mês. Sem `meses`, a API devolve todo o histórico. */
  getEvolucaoPatrimonio(meses?: number): Observable<EvolucaoPatrimonio[]> {
    const params = meses ? new HttpParams().set('meses', meses) : undefined;

    return this.http.get<EvolucaoPatrimonio[]>(`${this.api}/usuario/${this.login.getIdUsuario()}/evolucao`, { params }).pipe(
      avisarFalha(this.mensagens, 'carregar a evolução do patrimônio')
    );
  }

  /** Resumo completo do mês (fixo x variável, maior gasto, ranking, dia da semana e saúde financeira). */
  getPainelMes(mesAno: string): Observable<PainelMes> {
    const url = `${this.api}/usuario/${this.login.getIdUsuario()}/mesAno/${encodeURIComponent(mesAno)}`;
    return this.http.get<PainelMes>(url).pipe(
      avisarFalha(this.mensagens, 'carregar o painel do mês')
    );
  }
}
