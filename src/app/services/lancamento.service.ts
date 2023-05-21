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

  constructor(private http: HttpClient) { }

  getAllLancamentos(): Observable<Lancamento[]>{
    return this.http.get<Lancamento[]>(`${this.baseApiUrl}api/lancamentos/data/`);
  }

  postLancamento(formData: FormData): Observable<FormData>{
    // O "Z" no final indica que esta data e hora está em UTC.
    var dataLancamento = new Date(formData.getAll("dataHora").toString()+"Z");
    
    var data = { 
      dataHora: dataLancamento,
      valor: Number(formData.getAll("valor")),
      descricao: formData.getAll("descricao").toString(),
      status: formData.getAll("status").toString(),
      idCCusto: Number(formData.getAll("idCCusto")),
      idUsuario: Number(formData.getAll("idUsuario"))
    }; 

    return this.http.post<FormData>(`${this.baseApiUrl}api/lancamentos`, data);
  }

  excluirLancamento(id: Number){
    var data = { 
      deletado: '*'
    };
    return this.http.put(`${this.baseApiUrl}api/lancamentos/del/${id}`, data);
  }
}
