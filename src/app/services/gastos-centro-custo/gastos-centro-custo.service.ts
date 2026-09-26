import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { avisarFalha } from 'src/app/core/http';
import { GastosCentroCusto } from 'src/types';
import { LoginService } from '../login/login.service';
import { MensagensService } from '../mensagens/mensagens.service';

@Injectable({
  providedIn: 'root'
})
export class GastosCentroCustoService {
  private http = inject(HttpClient);
  private login = inject(LoginService);
  private mensagens = inject(MensagensService);

  getAllGastosCentroMesAno(mesAno: string): Observable<GastosCentroCusto[]> {
    const url = `${environment.baseApiUrl}api/gastoscentrocustos/usuario/${this.login.getIdUsuario()}/mesano/${encodeURIComponent(mesAno)}`;
    return this.http.get<GastosCentroCusto[]>(url).pipe(
      avisarFalha(this.mensagens, 'carregar os gastos por centro de custo')
    );
  }
}
