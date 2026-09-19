import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { avisarFalha } from 'src/app/core/http';
import { Lancamento, LancamentoPayload } from 'src/types';
import { LoginService } from '../login/login.service';
import { MensagensService } from '../mensagens/mensagens.service';

export interface FiltroLancamentos {
  dataDe: string;
  dataAte: string;
  /** Os status marcados; a API recebe todos concatenados em um único texto. */
  status: string[];
  idCentroCusto: number;
}

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {
  private http = inject(HttpClient);
  private login = inject(LoginService);
  private mensagens = inject(MensagensService);
  private api = `${environment.baseApiUrl}api/lancamentos`;

  /** Lançamentos do ciclo atual (a API decide a data inicial). */
  getAllLancamentos(): Observable<Lancamento[]> {
    return this.http.get<Lancamento[]>(`${this.api}/usuario/${this.login.getIdUsuario()}`).pipe(
      avisarFalha(this.mensagens, 'carregar os lançamentos')
    );
  }

  getLancamentoPorId(id: number): Observable<Lancamento> {
    return this.http.get<Lancamento>(`${this.api}/${id}`).pipe(
      avisarFalha(this.mensagens, 'carregar o lançamento')
    );
  }

  getLancamentoDataDeAte(filtro: FiltroLancamentos): Observable<Lancamento[]> {
    const params = new HttpParams()
      .set('idUsuario', String(this.login.getIdUsuario()))
      .set('dataDe', filtro.dataDe)
      .set('dataAte', filtro.dataAte)
      .set('status', filtro.status.join(''))
      .set('idCentroCusto', String(filtro.idCentroCusto));

    return this.http.get<Lancamento[]>(`${this.api}/dataDeAte`, { params }).pipe(
      avisarFalha(this.mensagens, 'filtrar os lançamentos')
    );
  }

  postLancamento(dados: LancamentoPayload): Observable<unknown> {
    return this.http.post(this.api, this.corpo(dados)).pipe(
      avisarFalha(this.mensagens, 'registrar o lançamento')
    );
  }

  putLancamento(id: number, dados: LancamentoPayload): Observable<unknown> {
    return this.http.put(`${this.api}/${id}`, this.corpo(dados)).pipe(
      avisarFalha(this.mensagens, 'atualizar o lançamento')
    );
  }

  excluirLancamento(id: number): Observable<unknown> {
    return this.http.put(`${this.api}/del/${id}`, { deletado: '*' }).pipe(
      avisarFalha(this.mensagens, 'excluir o lançamento')
    );
  }

  /** Quantos lançamentos usam o centro de custo (usado para bloquear a exclusão). */
  getExisteCentroCusto(idCentroCusto: number): Observable<{ quantidade: number }> {
    return this.http.get<{ quantidade: number }>(
      `${this.api}/usuario/${this.login.getIdUsuario()}/idcentrocusto/${idCentroCusto}`
    ).pipe(
      avisarFalha(this.mensagens, 'verificar o centro de custo')
    );
  }

  private corpo(dados: LancamentoPayload) {
    return {
      dataHora: new Date(dados.dataHora + 'Z'),
      valor: dados.valor,
      descricao: dados.descricao.trim(),
      status: dados.status,
      idCCusto: dados.idCCusto,
      idUsuario: Number(this.login.getIdUsuario())
    };
  }
}
