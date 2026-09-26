import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { avisarFalha } from 'src/app/core/http';
import { DetalhamentoGastosCentroCusto } from 'src/types';
import { LoginService } from '../login/login.service';
import { MensagensService } from '../mensagens/mensagens.service';

@Injectable({
  providedIn: 'root'
})
export class DetalhamentoGastosCentroCustoService {
  private http = inject(HttpClient);
  private login = inject(LoginService);
  private mensagens = inject(MensagensService);

  getAllDetalhamentoGastosCentroMesAno(mesAno: string, descCC: string): Observable<DetalhamentoGastosCentroCusto[]> {
    const params = new HttpParams()
      .set('idUsuario', String(this.login.getIdUsuario()))
      .set('mesAno', mesAno)
      .set('descCC', descCC);

    return this.http.get<DetalhamentoGastosCentroCusto[]>(
      `${environment.baseApiUrl}api/detalhamentogastoscentrocustos/descricaoCC`, { params }
    ).pipe(
      avisarFalha(this.mensagens, 'carregar o detalhamento dos gastos')
    );
  }
}
