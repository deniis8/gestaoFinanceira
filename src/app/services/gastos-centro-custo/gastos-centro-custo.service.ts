import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { LoginService } from '../login/login.service';
import { GastosCentroCusto } from 'src/types';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class GastosCentroCustoService {

  private baseApiUrl = environment.baseApiUrl;
  
  constructor(private http: HttpClient, private loginService: LoginService) { }

  //Não consumo mais essa rota
  /*getAllGastosCentroCustos(): Observable<GastosCentroCusto[]>{
    return this.http.get<GastosCentroCusto[]>(`${this.baseApiUrl}api/gastoscentrocustos/data`);
  }*/

  getAllGastosCentroMesAno(mesAno?: string): Observable<GastosCentroCusto[]>{
    const idUsuario = this.loginService.getIdUsuario();
    return this.http.get<GastosCentroCusto[]>(`${this.baseApiUrl}api/gastoscentrocustos/usuario/${idUsuario}/mesano/${mesAno}`).pipe(
      catchError(error => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: `Erro ao buscar gastos por centro de custo: ${error.status}`
        });
        return throwError(error);
      })
    );
  }
}
