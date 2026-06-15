import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from '../login/login.service';
import { Saldo } from 'src/types';
import { MensagensService } from '../mensagens/mensagens.service';

@Injectable({
  providedIn: 'root'
})
export class SaldoService {
  private baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient, private loginService: LoginService, private mensagensService: MensagensService) { }

  getSaldos(): Observable<Saldo>{
    const idUsuario = this.loginService.getIdUsuario();
    return this.http.get<Saldo>(`${this.baseApiUrl}api/saldosinvestimentos/usuario/${idUsuario}`).pipe(
      catchError(error => {
        this.mensagensService.mensagem('error', 'Erro', `Erro ao buscar saldos: ${error.status}`, undefined);
        return throwError(error);
      })
    );
  }
}
