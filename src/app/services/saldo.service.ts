import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Saldo } from '../models/Saldo';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class SaldoService {
  private baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  getSaldos(): Observable<Saldo>{
    return this.http.get<Saldo>(`${this.baseApiUrl}api/saldosinvestimentos`);
  }
}
