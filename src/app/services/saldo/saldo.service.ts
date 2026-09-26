import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { avisarFalha } from 'src/app/core/http';
import { Saldo } from 'src/types';
import { LoginService } from '../login/login.service';
import { MensagensService } from '../mensagens/mensagens.service';

@Injectable({
  providedIn: 'root'
})
export class SaldoService {
  private http = inject(HttpClient);
  private login = inject(LoginService);
  private mensagens = inject(MensagensService);

  getSaldos(): Observable<Saldo> {
    return this.http.get<Saldo>(`${environment.baseApiUrl}api/saldosinvestimentos/usuario/${this.login.getIdUsuario()}`).pipe(
      avisarFalha(this.mensagens, 'carregar o saldo')
    );
  }
}
