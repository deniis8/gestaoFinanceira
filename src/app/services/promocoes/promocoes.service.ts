import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Promocao, TipoPromocao } from 'src/types';

/** Rota pública da API (não exige login): ofertas garimpadas no Promobit. */
@Injectable({
  providedIn: 'root'
})
export class PromocoesService {
  private http = inject(HttpClient);

  getPromocoes(tipo: TipoPromocao): Observable<Promocao[]> {
    return this.http.get<Promocao[]>(`${environment.baseApiUrl}api/promocoes`, { params: { tipo } });
  }
}
