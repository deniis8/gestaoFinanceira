import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Saldo } from '../Saldo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaldoService {
  private baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getSaldos(): Observable<Saldo>{
    return this.http.get<Saldo>(`${this.baseApiUrl}api/saldosinvestimentos`);
  }
}
