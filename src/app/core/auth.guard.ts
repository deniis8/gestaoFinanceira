import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';

/** Sem token nem refresh token guardados, a única rota possível é o login. */
export const authGuard: CanActivateFn = () => {
  return inject(LoginService).estaLogado() || inject(Router).createUrlTree(['/login']);
};
