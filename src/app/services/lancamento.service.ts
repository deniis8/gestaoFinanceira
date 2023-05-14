import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lancamento } from '../Lancamento';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {
  private baseApiUrl = environment.baseApiUrl;
  private apiUrl = `${this.baseApiUrl}api/lancamentos`;
  private apiUrlLancamentos = `${this.baseApiUrl}api/lancamentos/data/`;

  constructor(private http: HttpClient) { }

  getAllLancamentos(): Observable<Lancamento[]>{
    return this.http.get<Lancamento[]>(this.apiUrlLancamentos);
  }

  postLancamento(formData: FormData): Observable<FormData>{
    var dataFormat = new Date(formData.getAll("dataHora").toString()); 
    
    var data = {
      dataHora: dataFormat,
      valor: Number(formData.getAll("valor")),
      descricao: formData.getAll("descricao").toString(),
      status: formData.getAll("status").toString(),
      idCCusto: Number(formData.getAll("idCCusto")),
      idUsuario: Number(formData.getAll("idUsuario"))
    }; 

    return this.http.post<FormData>(this.apiUrl, data);
  }
}
