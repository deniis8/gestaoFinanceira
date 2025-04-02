import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { LancamentoFixo } from '../models/Lancamento-Fixo';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LancamentoFixoService {
  
  private baseApiUrl = environment.baseApiUrl;
  constructor(private http: HttpClient, private loginService: LoginService) { }

  getAllLancamentos(): Observable<LancamentoFixo[]> {
      const idUsuario = this.loginService.getIdUsuario();
      return this.http.get<LancamentoFixo[]>(`${this.baseApiUrl}api/lancamentosfixos/usuario/${idUsuario}`);
    }
  
    getLancamentoPorId(id: Number): Observable<LancamentoFixo> {
      return this.http.get<LancamentoFixo>(`${this.baseApiUrl}api/lancamentosfixos/${id}`);
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
      
      return this.http.post<FormData>(`${this.baseApiUrl}api/lancamentosfixos`, data);
    }
  
    excluirLancamento(id: Number) {
      var data = { 
        deletado: '*'
      };
      return this.http.put(`${this.baseApiUrl}api/lancamentosfixos/del/${id}`, data);
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
  
      return this.http.put<FormData>(`${this.baseApiUrl}api/lancamentosfixos/${id}`, data);
    }

}
