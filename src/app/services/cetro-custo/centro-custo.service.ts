import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginService } from '../login/login.service';
import { CentroCusto } from 'src/types';

@Injectable({
  providedIn: 'root'
})
export class CentroCustoService {

  private baseApiUrl = environment.baseApiUrl;
  
  constructor(private http: HttpClient, private loginService: LoginService) { }
  
  getAllCentroCustos(): Observable<CentroCusto[]>{
    const idUsuario = this.loginService.getIdUsuario();
    return this.http.get<CentroCusto[]>(`${this.baseApiUrl}api/centrocustos/usuario/${idUsuario}`);
  }

  getIdCentroCustos(id: Number): Observable<CentroCusto>{
    return this.http.get<CentroCusto>(`${this.baseApiUrl}api/centrocustos/${id}`);
  }

  postCentroCusto(formData: FormData): Observable<FormData> {
    var data = { 
      descriCCusto: formData.getAll("descriCCusto").toString().trim(),
      idUsuario: Number(formData.getAll("idUsuario"))
    }; 
    console.log("Data: "); 
    console.log(data);   
    return this.http.post<FormData>(`${this.baseApiUrl}api/centrocustos`, data);
  }

  putCentroCustos(id: Number, formData: FormData): Observable<FormData> {
    var data = { 
      descriCCusto: formData.getAll("descriCCusto").toString().trim()
    };

    return this.http.put<FormData>(`${this.baseApiUrl}api/centrocustos/${id}`, data);
  }

  excluirCentroCusto(id: Number) {
    var data = { 
      deletado: '*'
    };
    return this.http.put(`${this.baseApiUrl}api/centrocustos/del/${id}`, data);
  } 

}
