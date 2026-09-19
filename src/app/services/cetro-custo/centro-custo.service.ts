import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { avisarFalha } from 'src/app/core/http';
import { CentroCusto, CentroCustoPayload } from 'src/types';
import { LoginService } from '../login/login.service';
import { MensagensService } from '../mensagens/mensagens.service';

@Injectable({
  providedIn: 'root'
})
export class CentroCustoService {
  private http = inject(HttpClient);
  private login = inject(LoginService);
  private mensagens = inject(MensagensService);
  private api = `${environment.baseApiUrl}api/centrocustos`;

  getAllCentroCustos(): Observable<CentroCusto[]> {
    return this.http.get<CentroCusto[]>(`${this.api}/usuario/${this.login.getIdUsuario()}`).pipe(
      avisarFalha(this.mensagens, 'carregar os centros de custo')
    );
  }

  getIdCentroCustos(id: number): Observable<CentroCusto> {
    return this.http.get<CentroCusto>(`${this.api}/${id}`).pipe(
      avisarFalha(this.mensagens, 'carregar o centro de custo')
    );
  }

  postCentroCusto(dados: CentroCustoPayload): Observable<unknown> {
    const corpo = {
      descriCCusto: dados.descriCCusto.trim(),
      valorLimite: dados.valorLimite,
      idUsuario: Number(this.login.getIdUsuario())
    };
    return this.http.post(this.api, corpo).pipe(
      avisarFalha(this.mensagens, 'criar o centro de custo')
    );
  }

  putCentroCustos(id: number, dados: CentroCustoPayload): Observable<unknown> {
    const corpo = { descriCCusto: dados.descriCCusto.trim(), valorLimite: dados.valorLimite };
    return this.http.put(`${this.api}/${id}`, corpo).pipe(
      avisarFalha(this.mensagens, 'atualizar o centro de custo')
    );
  }

  excluirCentroCusto(id: number): Observable<unknown> {
    return this.http.put(`${this.api}/del/${id}`, { deletado: '*' }).pipe(
      avisarFalha(this.mensagens, 'excluir o centro de custo')
    );
  }
}
