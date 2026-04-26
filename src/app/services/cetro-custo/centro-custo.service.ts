import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginService } from '../login/login.service';
import { CentroCusto } from 'src/types';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CentroCustoService {

  private baseApiUrl = environment.baseApiUrl;
  
  constructor(private http: HttpClient, private loginService: LoginService) { }
  
  getAllCentroCustos(): Observable<CentroCusto[]>{
    const idUsuario = this.loginService.getIdUsuario();
    return this.http.get<CentroCusto[]>(`${this.baseApiUrl}api/centrocustos/usuario/${idUsuario}`).pipe(
      catchError(error => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: `Erro ao buscar centros de custo: ${error.status}`
        });
        return throwError(error);
      })
    );
  }

  getIdCentroCustos(id: Number): Observable<CentroCusto>{
    return this.http.get<CentroCusto>(`${this.baseApiUrl}api/centrocustos/${id}`).pipe(
      catchError(error => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: `Erro ao buscar centro de custo: ${error.status}`
        });
        return throwError(error);
      })
    );
  }

  postCentroCusto(formData: FormData): Observable<any> {
    var data = { 
      descriCCusto: formData.getAll("descriCCusto").toString().trim(),
      valorLimite: Number(formData.getAll("valorLimite")),
      idUsuario: Number(formData.getAll("idUsuario"))
    }; 
    console.log("Data: "); 
    console.log(data);   
    return this.http.post<any>(`${this.baseApiUrl}api/centrocustos`, data).pipe(
      catchError(error => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: `Erro ao criar centro de custo: ${error.status}`
        });
        return throwError(error);
      })
    );
  }

  putCentroCustos(id: Number, formData: FormData): Observable<any> {
    var data = { 
      descriCCusto: formData.getAll("descriCCusto").toString().trim(),
      valorLimite: Number(formData.getAll("valorLimite"))
    };

    return this.http.put<any>(`${this.baseApiUrl}api/centrocustos/${id}`, data).pipe(
      catchError(error => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: `Erro ao atualizar centro de custo: ${error.status}`
        });
        return throwError(error);
      })
    );
  }

  excluirCentroCusto(id: Number): Observable<any> {
    var data = { 
      deletado: '*'
    };
    return this.http.put(`${this.baseApiUrl}api/centrocustos/del/${id}`, data).pipe(
      catchError(error => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: `Erro ao excluir centro de custo: ${error.status}`
        });
        return throwError(error);
      })
    );
  } 

}
