import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClimaAmbiente } from '../../models/Clima-Ambiente';
import { Imagens } from '../../models/Imagens';

@Injectable({
  providedIn: 'root'
})
export class ClimaAmbienteService {

  private baseApiUrl = environment.baseApiUrlClimaAmbiente;
  
  constructor(private http: HttpClient) { }

  getClimaAmbienteService(): Observable<ClimaAmbiente[]>{
    return this.http.get<ClimaAmbiente[]>(`${this.baseApiUrl}api/climaambientes/data`);
  }

  getImagensService(): Observable<Imagens[]>{
    return this.http.get<Imagens[]>(`${this.baseApiUrl}api/imagens`);
  }
}
