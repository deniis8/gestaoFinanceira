import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginService } from '../login/login.service';
import { GastosMensais } from 'src/types';

@Injectable({
  providedIn: 'root'
})
export class GastosMensaisService {

  private baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  getGastosMensais(dataDe: string, dataAte: string): Observable<GastosMensais[]> {
    const idUsuario = this.loginService.getIdUsuario();
    if (dataDe && dataAte) {
      return this.http.get<GastosMensais[]>(`${this.baseApiUrl}api/gastosmensais?idUsuario=${idUsuario}&dataDe=${dataDe}&dataAte=${dataAte}`);
    } else {
      return this.http.get<GastosMensais[]>(`${this.baseApiUrl}api/gastosmensais?idUsuario=${idUsuario}`);
    }

  }
}
