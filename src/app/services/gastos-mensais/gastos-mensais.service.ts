import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { avisarFalha } from 'src/app/core/http';
import { GastosMensais } from 'src/types';
import { LoginService } from '../login/login.service';
import { MensagensService } from '../mensagens/mensagens.service';

@Injectable({
  providedIn: 'root'
})
export class GastosMensaisService {
  private http = inject(HttpClient);
  private login = inject(LoginService);
  private mensagens = inject(MensagensService);

  /** Sem as duas datas, a API devolve todo o histórico. */
  getGastosMensais(dataDe?: string, dataAte?: string): Observable<GastosMensais[]> {
    let params = new HttpParams().set('idUsuario', String(this.login.getIdUsuario()));
    if (dataDe && dataAte) {
      params = params.set('dataDe', dataDe).set('dataAte', dataAte);
    }

    return this.http.get<GastosMensais[]>(`${environment.baseApiUrl}api/gastosmensais`, { params }).pipe(
      avisarFalha(this.mensagens, 'carregar os gastos mensais')
    );
  }
}
