import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GastosMensais } from '../models/Gastos-Mensais';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class GastosMensaisService {

  private baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  getGastosMensais(): Observable<GastosMensais[]>{
    return this.http.get<GastosMensais[]>(`${this.baseApiUrl}api/gastosmensais`);
  }
}
