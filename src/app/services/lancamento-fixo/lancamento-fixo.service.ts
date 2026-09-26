import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { avisarFalha } from 'src/app/core/http';
import { LancamentoFixo, LancamentoFixoPayload } from 'src/types';
import { LoginService } from '../login/login.service';
import { MensagensService } from '../mensagens/mensagens.service';

@Injectable({
  providedIn: 'root'
})
export class LancamentoFixoService {
  private http = inject(HttpClient);
  private login = inject(LoginService);
  private mensagens = inject(MensagensService);
  private api = `${environment.baseApiUrl}api/lancamentosfixos`;

  getAllLancamentosFixos(): Observable<LancamentoFixo[]> {
    return this.http.get<LancamentoFixo[]>(`${this.api}/usuario/${this.login.getIdUsuario()}`).pipe(
      avisarFalha(this.mensagens, 'carregar os lançamentos fixos')
    );
  }

  getLancamentoFixoPorId(id: number): Observable<LancamentoFixo> {
    return this.http.get<LancamentoFixo>(`${this.api}/${id}`).pipe(
      avisarFalha(this.mensagens, 'carregar o lançamento fixo')
    );
  }

  postLancamentoFixo(dados: LancamentoFixoPayload): Observable<unknown> {
    return this.http.post(this.api, this.corpo(dados)).pipe(
      avisarFalha(this.mensagens, 'criar o lançamento fixo')
    );
  }

  putLancamentoFixo(id: number, dados: LancamentoFixoPayload): Observable<unknown> {
    return this.http.put(`${this.api}/${id}`, this.corpo(dados)).pipe(
      avisarFalha(this.mensagens, 'atualizar o lançamento fixo')
    );
  }

  excluirLancamentoFixo(id: number): Observable<unknown> {
    return this.http.put(`${this.api}/del/${id}`, { deletado: '*' }).pipe(
      avisarFalha(this.mensagens, 'excluir o lançamento fixo')
    );
  }

  private corpo(dados: LancamentoFixoPayload) {
    return {
      diaMes: dados.diaMes,
      valor: dados.valor,
      descricao: dados.descricao.trim(),
      status: dados.status,
      idCCusto: dados.idCCusto,
      idUsuario: Number(this.login.getIdUsuario())
    };
  }
}
