import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CentroCusto } from '../Centro-Custo';

@Injectable({
  providedIn: 'root'
})
export class CentroCustoService {

  private baseApiUrl = environment.baseApiUrl;
  
  constructor(private http: HttpClient) { }

  getAllCentroCustos(): Observable<CentroCusto[]>{
    return this.http.get<CentroCusto[]>(`${this.baseApiUrl}api/centrocustos`);
  }

}
