import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lancamento } from '../models/Lancamento';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {
  private baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getAllLancamentos(): Observable<Lancamento[]> {
    return this.http.get<Lancamento[]>(`${this.baseApiUrl}api/lancamentos/data/`);
  }

  getLancamentoPorId(id: Number): Observable<Lancamento> {
    return this.http.get<Lancamento>(`${this.baseApiUrl}api/lancamentos/${id}`);
  }

  getLancamentoDataDeAte(dataDe: string, dataAte: string, status: string, idCentroCusto: Number): Observable<Lancamento[]> {
    const url = `${this.baseApiUrl}api/lancamentos/dataDeAte?dataDe=${dataDe}&dataAte=${dataAte}&status=${status}&idCentroCusto=${idCentroCusto}`;
    console.log(url);
    return this.http.get<Lancamento[]>(url);
  }

  postLancamento(formData: FormData): Observable<FormData> {
    var dataLancamento = new Date(formData.getAll("dataHora").toString() + "Z");
    var data = { 
      dataHora: dataLancamento,
      valor: Number(formData.getAll("valor")),
      descricao: formData.getAll("descricao").toString(),
      status: formData.getAll("status").toString(),
      idCCusto: Number(formData.getAll("idCCusto")),
      idUsuario: Number(formData.getAll("idUsuario"))
    };

    console.log(data);
    
    return this.http.post<FormData>(`${this.baseApiUrl}api/lancamentos`, data);
  }

  excluirLancamento(id: Number) {
    var data = { 
      deletado: '*'
    };
    return this.http.put(`${this.baseApiUrl}api/lancamentos/del/${id}`, data);
  }

  putLancamento(id: Number, formData: FormData): Observable<FormData> {
    var dataLancamento = new Date(formData.getAll("dataHora").toString() + "Z");
    var data = { 
      dataHora: dataLancamento,
      valor: Number(formData.getAll("valor")),
      descricao: formData.getAll("descricao").toString(),
      status: formData.getAll("status").toString(),
      idCCusto: Number(formData.getAll("idCCusto")),
      idUsuario: Number(formData.getAll("idUsuario"))
    };

    return this.http.put<FormData>(`${this.baseApiUrl}api/lancamentos/${id}`, data);
  }
}
