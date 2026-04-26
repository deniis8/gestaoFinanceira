import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from '../login/login.service';
import { Saldo } from 'src/types';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SaldoService {
  private baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  getSaldos(): Observable<Saldo>{
    const idUsuario = this.loginService.getIdUsuario();
    return this.http.get<Saldo>(`${this.baseApiUrl}api/saldosinvestimentos/usuario/${idUsuario}`).pipe(
      catchError(error => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: `Erro ao buscar saldos: ${error.status}`
        });
        return throwError(error);
      })
    );
  }
}
