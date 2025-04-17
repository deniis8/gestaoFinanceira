import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from '../login/login.service';
import { LancamentoFixo } from '../../models/Lancamento-Fixo';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LancamentoFixoService {
  
  private baseApiUrl = environment.baseApiUrl;
  constructor(private http: HttpClient, private loginService: LoginService) { }

  getAllLancamentosFixos(): Observable<LancamentoFixo[]> {
      const idUsuario = this.loginService.getIdUsuario();
      return this.http.get<LancamentoFixo[]>(`${this.baseApiUrl}api/lancamentosfixos/usuario/${idUsuario}`);
    }
  
    getLancamentoFixoPorId(id: Number): Observable<LancamentoFixo> {
      return this.http.get<LancamentoFixo>(`${this.baseApiUrl}api/lancamentosfixos/${id}`);
    }
  
    postLancamentoFixo(formData: FormData): Observable<FormData> {
      var data = { 
        diaMes: Number(formData.getAll("diaMes")),
        valor: Number(formData.getAll("valor")),
        descricao: formData.getAll("descricao").toString().trim(),
        status: formData.getAll("status").toString(),
        idCCusto: Number(formData.getAll("idCCusto")),
        idUsuario: Number(formData.getAll("idUsuario"))
      };
  
      console.log(data);
      
      return this.http.post<FormData>(`${this.baseApiUrl}api/lancamentosfixos`, data);
    }
  
    excluirLancamentoFixo(id: Number) {
      var data = { 
        deletado: '*'
      };
      return this.http.put(`${this.baseApiUrl}api/lancamentosfixos/del/${id}`, data);
    }
  
    putLancamentoFixo(id: Number, formData: FormData): Observable<FormData> {
      var data = { 
        diaMes: Number(formData.getAll("diaMes")),
        valor: Number(formData.getAll("valor")),
        descricao: formData.getAll("descricao").toString().trim(),
        status: formData.getAll("status").toString(),
        idCCusto: Number(formData.getAll("idCCusto")),
        idUsuario: Number(formData.getAll("idUsuario"))
      };
  
      return this.http.put<FormData>(`${this.baseApiUrl}api/lancamentosfixos/${id}`, data);
    }

}
