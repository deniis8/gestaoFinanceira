import { Location } from '@angular/common';
import { Router } from '@angular/router';

/** Volta para a tela anterior do app; se a página foi aberta direto, vai para a lista de origem. */
export function voltarOu(location: Location, router: Router, rotaPadrao: string): void {
  const navegouDentroDoApp = (history.state?.navigationId ?? 0) > 1;
  if (navegouDentroDoApp) {
    location.back();
  } else {
    router.navigate([rotaPadrao]);
  }
}
