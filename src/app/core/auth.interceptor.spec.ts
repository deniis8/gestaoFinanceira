import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { LoginService } from '../services/login/login.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let controle: HttpTestingController;
  let login: jasmine.SpyObj<LoginService>;

  beforeEach(() => {
    login = jasmine.createSpyObj<LoginService>('LoginService', ['getAuthToken', 'getRefreshToken', 'refreshToken', 'storeTokens', 'logout']);
    login.getAuthToken.and.returnValue('token-atual');
    login.getRefreshToken.and.returnValue('refresh');

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: LoginService, useValue: login }
      ]
    });
    http = TestBed.inject(HttpClient);
    controle = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controle.verify());

  it('envia o token em toda requisição', () => {
    http.get('/api/x').subscribe();

    const req = controle.expectOne('/api/x');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-atual');
    req.flush({});
  });

  it('renova o token no 401 e repete a requisição com o novo', () => {
    login.refreshToken.and.returnValue(of({ token: 'novo', refreshToken: 'r2', idUsuario: 1 }));
    let resposta: unknown;
    http.get('/api/x').subscribe(r => (resposta = r));

    controle.expectOne('/api/x').flush({}, { status: 401, statusText: 'Unauthorized' });

    const repetida = controle.expectOne('/api/x');
    expect(repetida.request.headers.get('Authorization')).toBe('Bearer novo');
    repetida.flush({ ok: true });

    expect(login.storeTokens).toHaveBeenCalled();
    expect(resposta).toEqual({ ok: true });
  });

  it('encerra a sessão quando a renovação falha', () => {
    login.refreshToken.and.returnValue(throwError(() => new Error('falhou')));
    let falhou = false;
    http.get('/api/x').subscribe({ error: () => (falhou = true) });

    controle.expectOne('/api/x').flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(login.logout).toHaveBeenCalled();
    expect(falhou).toBeTrue();
  });

  it('encerra a sessão quando não há refresh token', () => {
    login.getRefreshToken.and.returnValue(null);
    let falhou = false;
    http.get('/api/x').subscribe({ error: () => (falhou = true) });

    controle.expectOne('/api/x').flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(login.logout).toHaveBeenCalled();
    expect(falhou).toBeTrue();
  });

  it('não tenta renovar quando o próprio login devolve 401', () => {
    http.post('/api/auth/login', {}).subscribe({ error: () => undefined });

    controle.expectOne('/api/auth/login').flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(login.refreshToken).not.toHaveBeenCalled();
  });
});
