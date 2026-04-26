import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { LoginService } from '../login/login.service';
import { DetalhamentoGastosCentroCusto } from 'src/types';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class DetalhamentoGastosCentroCustoService {

  private baseApiUrl = environment.baseApiUrl;
  
  constructor(private http: HttpClient, private loginService: LoginService) { }

  getAllDetalhamentoGastosCentroMesAno(mesAno?: string, descCC?: string): Observable<DetalhamentoGastosCentroCusto[]>{
    const idUsuario = this.loginService.getIdUsuario();
    return this.http.get<DetalhamentoGastosCentroCusto[]>(`${this.baseApiUrl}api/detalhamentogastoscentrocustos/descricaoCC?idUsuario=${idUsuario}&mesAno=${mesAno}&descCC=${descCC}`).pipe(
      catchError(error => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: `Erro ao buscar detalhamento de gastos: ${error.status}`
        });
        return throwError(error);
      })
    );
  }
}
