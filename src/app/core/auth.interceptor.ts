import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, finalize, map, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { LoginService } from '../services/login/login.service';

/** Renovação em andamento: várias requisições com 401 esperam a mesma resposta. */
let renovacao$: Observable<string> | null = null;

function comToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

function renovarToken(login: LoginService): Observable<string> {
  if (!renovacao$) {
    if (!login.getRefreshToken()) {
      login.logout();
      return throwError(() => new Error('401'));
    }

    renovacao$ = login.refreshToken().pipe(
      tap(tokens => login.storeTokens(tokens)),
      map(tokens => tokens.token),
      catchError(erro => {
        login.logout();
        return throwError(() => erro);
      }),
      finalize(() => (renovacao$ = null)),
      shareReplay({ bufferSize: 1, refCount: false })
    );
  }
  return renovacao$;
}

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const login = inject(LoginService);
  const token = login.getAuthToken();
  const requisicao = token ? comToken(req, token) : req;
  const ehRotaDeAuth = req.url.includes('auth/login') || req.url.includes('auth/refresh');

  return next(requisicao).pipe(
    catchError(erro => {
      if (erro instanceof HttpErrorResponse && erro.status === 401 && !ehRotaDeAuth) {
        return renovarToken(login).pipe(switchMap(novoToken => next(comToken(req, novoToken))));
      }
      return throwError(() => erro);
    })
  );
};
