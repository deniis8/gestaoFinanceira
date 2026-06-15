import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from '../login/login.service';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LancamentoFixo } from 'src/types';
import { MensagensService } from '../mensagens/mensagens.service';

@Injectable({
  providedIn: 'root'
})
export class LancamentoFixoService {
  
  private baseApiUrl = environment.baseApiUrl;
  constructor(private http: HttpClient, private loginService: LoginService, private mensagensService: MensagensService) { }

  getAllLancamentosFixos(): Observable<LancamentoFixo[]> {
      const idUsuario = this.loginService.getIdUsuario();
      return this.http.get<LancamentoFixo[]>(`${this.baseApiUrl}api/lancamentosfixos/usuario/${idUsuario}`).pipe(
        catchError(error => {
          this.mensagensService.mensagem('error', 'Erro', `Erro ao buscar lançamentos fixos: ${error.status}`, undefined);
          return throwError(error);
        })
      );
    }
  
    getLancamentoFixoPorId(id: Number): Observable<LancamentoFixo> {
      return this.http.get<LancamentoFixo>(`${this.baseApiUrl}api/lancamentosfixos/${id}`).pipe(
        catchError(error => {
          this.mensagensService.mensagem('error', 'Erro', `Erro ao buscar lançamento fixo: ${error.status}`, undefined);
          return throwError(error);
        })
      );
    }
  
    postLancamentoFixo(formData: FormData): Observable<any> {
      var data = { 
        diaMes: Number(formData.getAll("diaMes")),
        valor: Number(formData.getAll("valor")),
        descricao: formData.getAll("descricao").toString().trim(),
        status: formData.getAll("status").toString(),
        idCCusto: Number(formData.getAll("idCCusto")),
        idUsuario: Number(formData.getAll("idUsuario"))
      };
  
      console.log(data);
      
      return this.http.post<any>(`${this.baseApiUrl}api/lancamentosfixos`, data).pipe(
        catchError(error => {
          this.mensagensService.mensagem('error', 'Erro', `Erro ao criar lançamento fixo: ${error.status}`, undefined);
          return throwError(error);
        })
      );
    }
  
    excluirLancamentoFixo(id: Number): Observable<any> {
      var data = { 
        deletado: '*'
      };
      return this.http.put(`${this.baseApiUrl}api/lancamentosfixos/del/${id}`, data).pipe(
        catchError(error => {
          this.mensagensService.mensagem('error', 'Erro', `Erro ao excluir lançamento fixo: ${error.status}`, undefined);
          return throwError(error);
        })
      );
    }
  
    putLancamentoFixo(id: Number, formData: FormData): Observable<any> {
      var data = { 
        diaMes: Number(formData.getAll("diaMes")),
        valor: Number(formData.getAll("valor")),
        descricao: formData.getAll("descricao").toString().trim(),
        status: formData.getAll("status").toString(),
        idCCusto: Number(formData.getAll("idCCusto")),
        idUsuario: Number(formData.getAll("idUsuario"))
      };
  
      return this.http.put<any>(`${this.baseApiUrl}api/lancamentosfixos/${id}`, data).pipe(
        catchError(error => {
          this.mensagensService.mensagem('error', 'Erro', `Erro ao atualizar lançamento fixo: ${error.status}`, undefined);
          return throwError(error);
        })
      );
    }

}
