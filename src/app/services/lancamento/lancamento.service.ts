import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lancamento } from '../../models/Lancamento';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {
  private baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  getAllLancamentos(): Observable<Lancamento[]> {
    const idUsuario = this.loginService.getIdUsuario();
    return this.http.get<Lancamento[]>(`${this.baseApiUrl}api/lancamentos/usuario/${idUsuario}`);
  }

  getLancamentoPorId(id: Number): Observable<Lancamento> {
    return this.http.get<Lancamento>(`${this.baseApiUrl}api/lancamentos/${id}`);
  }

  getLancamentoDataDeAte(dataDe: string, dataAte: string, status: string, idCentroCusto: Number): Observable<Lancamento[]> {
    const idUsuario = this.loginService.getIdUsuario();
    const url = `${this.baseApiUrl}api/lancamentos/dataDeAte?idUsuario=${idUsuario}&dataDe=${dataDe}&dataAte=${dataAte}&status=${status}&idCentroCusto=${idCentroCusto}`;
    console.log(url);
    return this.http.get<Lancamento[]>(url);
  }

  postLancamento(formData: FormData): Observable<FormData> {
    var dataLancamento = new Date(formData.getAll("dataHora").toString() + "Z");
    var data = { 
      dataHora: dataLancamento,
      valor: Number(formData.getAll("valor")),
      descricao: formData.getAll("descricao").toString().trim(),
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
      descricao: formData.getAll("descricao").toString().trim(),
      status: formData.getAll("status").toString(),
      idCCusto: Number(formData.getAll("idCCusto")),
      idUsuario: Number(formData.getAll("idUsuario"))
    };

    return this.http.put<FormData>(`${this.baseApiUrl}api/lancamentos/${id}`, data);
  }

  getExisteCentroCusto(idUsuario: string, idCentroCusto: Number): Observable<any>{
    return this.http.get<any>(`${this.baseApiUrl}api/lancamentos/usuario/${idUsuario}/idcentrocusto/${idCentroCusto}`);
  }
}
