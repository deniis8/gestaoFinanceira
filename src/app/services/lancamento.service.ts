import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lancamento } from '../models/Lancamento';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service'; // Importando o serviço LoginService

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {
  private baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  // Método para obter o token de autenticação
  private getAuthHeaders() {
    const token = this.loginService.getAuthToken(); // Obtendo o token armazenado
    if (!token) {
      throw new Error('Token não encontrado');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllLancamentos(): Observable<Lancamento[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Lancamento[]>(`${this.baseApiUrl}api/lancamentos/data/`, { headers });
  }

  getLancamentoPorId(id: Number): Observable<Lancamento> {
    const headers = this.getAuthHeaders();
    return this.http.get<Lancamento>(`${this.baseApiUrl}api/lancamentos/${id}`, { headers });
  }

  getLancamentoDataDeAte(dataDe: string, dataAte: string, status: string, idCentroCusto: Number): Observable<Lancamento[]> {
    const headers = this.getAuthHeaders();
    const url = `${this.baseApiUrl}api/lancamentos/dataDeAte?dataDe=${dataDe}&dataAte=${dataAte}&status=${status}&idCentroCusto=${idCentroCusto}`;
    console.log(url);
    return this.http.get<Lancamento[]>(url, { headers });
  }

  postLancamento(formData: FormData): Observable<FormData> {
    const headers = this.getAuthHeaders();
    
    // O "Z" no final indica que esta data e hora está em UTC.
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
    
    return this.http.post<FormData>(`${this.baseApiUrl}api/lancamentos`, data, { headers });
  }

  excluirLancamento(id: Number) {
    const headers = this.getAuthHeaders();
    var data = { 
      deletado: '*'
    };
    return this.http.put(`${this.baseApiUrl}api/lancamentos/del/${id}`, data, { headers });
  }

  putLancamento(id: Number, formData: FormData): Observable<FormData> {
    const headers = this.getAuthHeaders();
    
    // O "Z" no final indica que esta data e hora está em UTC.
    var dataLancamento = new Date(formData.getAll("dataHora").toString() + "Z");
    var data = { 
      dataHora: dataLancamento,
      valor: Number(formData.getAll("valor")),
      descricao: formData.getAll("descricao").toString(),
      status: formData.getAll("status").toString(),
      idCCusto: Number(formData.getAll("idCCusto")),
      idUsuario: Number(formData.getAll("idUsuario"))
    };

    return this.http.put<FormData>(`${this.baseApiUrl}api/lancamentos/${id}`, data, { headers });
  }
}
