import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { LoginService } from '../login/login.service';
import { Saldo } from 'src/types';

@Injectable({
  providedIn: 'root'
})
export class SaldoService {
  private baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  getSaldos(): Observable<Saldo>{
    const idUsuario = this.loginService.getIdUsuario();
    return this.http.get<Saldo>(`${this.baseApiUrl}api/saldosinvestimentos/usuario/${idUsuario}`);
  }
}
