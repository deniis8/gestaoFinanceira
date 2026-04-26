import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginService } from '../login/login.service';
import { GastosMensais } from 'src/types';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class GastosMensaisService {

  private baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  getGastosMensais(dataDe: string, dataAte: string): Observable<GastosMensais[]> {
    const idUsuario = this.loginService.getIdUsuario();
    if (dataDe && dataAte) {
      return this.http.get<GastosMensais[]>(`${this.baseApiUrl}api/gastosmensais?idUsuario=${idUsuario}&dataDe=${dataDe}&dataAte=${dataAte}`).pipe(
        catchError(error => {
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: `Erro ao buscar gastos mensais: ${error.status}`
          });
          return throwError(error);
        })
      );
    } else {
      return this.http.get<GastosMensais[]>(`${this.baseApiUrl}api/gastosmensais?idUsuario=${idUsuario}`).pipe(
        catchError(error => {
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: `Erro ao buscar gastos mensais: ${error.status}`
          });
          return throwError(error);
        })
      );
    }

  }
}
