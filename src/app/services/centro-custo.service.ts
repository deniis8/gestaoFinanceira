import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CentroCusto } from '../models/Centro-Custo';
import { LoginService } from './login.service';

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

}
