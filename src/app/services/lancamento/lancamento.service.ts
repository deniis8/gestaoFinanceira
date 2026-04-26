import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginService } from '../login/login.service';
import { Lancamento } from 'src/types';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {
  private baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  getAllLancamentos(): Observable<Lancamento[]> {
    const idUsuario = this.loginService.getIdUsuario();
    return this.http.get<Lancamento[]>(`${this.baseApiUrl}api/lancamentos/usuario/${idUsuario}`).pipe(
      catchError(error => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: `Erro ao buscar Lançamentos: ${error.status}`
        });
        return throwError(error);
      })
    );
  }

  getLancamentoPorId(id: Number): Observable<Lancamento> {
    return this.http.get<Lancamento>(`${this.baseApiUrl}api/lancamentos/${id}`).pipe(
      catchError(error => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: `Erro ao buscar lançamento: ${error.status}`
        });
        return throwError(error);
      })
    );
  }

  getLancamentoDataDeAte(dataDe: string, dataAte: string, status: string, idCentroCusto: Number): Observable<Lancamento[]> {
    const idUsuario = this.loginService.getIdUsuario();
    const url = `${this.baseApiUrl}api/lancamentos/dataDeAte?idUsuario=${idUsuario}&dataDe=${dataDe}&dataAte=${dataAte}&status=${status}&idCentroCusto=${idCentroCusto}`;
    console.log(url);
    return this.http.get<Lancamento[]>(url).pipe(
      catchError(error => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: `Erro ao buscar Lançamentos: ${error.status}`
        });
        return throwError(error);
      })
    );
  }

  postLancamento(formData: FormData): Observable<any> {
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
    
    return this.http.post<any>(`${this.baseApiUrl}api/lancamentos`, data).pipe(
      catchError(error => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: `Erro ao criar lançamento: ${error.status}`
        });
        return throwError(error);
      })
    );
  }

  excluirLancamento(id: Number): Observable<any> {
    var data = { 
      deletado: '*'
    };
    return this.http.put(`${this.baseApiUrl}api/lancamentos/del/${id}`, data).pipe(
      catchError(error => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: `Erro ao excluir lançamento: ${error.status}`
        });
        return throwError(error);
      })
    );
  }

  putLancamento(id: Number, formData: FormData): Observable<any> {
    var dataLancamento = new Date(formData.getAll("dataHora").toString() + "Z");
    console.log(Number(formData.getAll("valor")));
    var data = { 
      dataHora: dataLancamento,
      valor: Number(formData.getAll("valor")),
      descricao: formData.getAll("descricao").toString().trim(),
      status: formData.getAll("status").toString(),
      idCCusto: Number(formData.getAll("idCCusto")),
      idUsuario: Number(formData.getAll("idUsuario"))
    };

    return this.http.put<any>(`${this.baseApiUrl}api/lancamentos/${id}`, data).pipe(
      catchError(error => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: `Erro ao atualizar lançamento: ${error.status}`
        });
        return throwError(error);
      })
    );
  }

  getExisteCentroCusto(idUsuario: string, idCentroCusto: Number): Observable<any>{
    return this.http.get<any>(`${this.baseApiUrl}api/lancamentos/usuario/${idUsuario}/idcentrocusto/${idCentroCusto}`).pipe(
      catchError(error => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: `Erro ao verificar centro de custo: ${error.status}`
        });
        return throwError(error);
      })
    );
  }
}
