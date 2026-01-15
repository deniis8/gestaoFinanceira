import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfiguracoesIA } from 'src/types';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracoesIaService {

  private baseApiUrl = environment.baseApiUrl;
    
    constructor(private http: HttpClient, private loginService: LoginService) { }
    
    getConfiguracaoIA(): Observable<ConfiguracoesIA>{
      const idUsuario = this.loginService.getIdUsuario();
      return this.http.get<ConfiguracoesIA>(`${this.baseApiUrl}api/configuracoesia/usuario/${idUsuario}`);
    }
}
