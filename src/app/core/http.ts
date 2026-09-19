import { HttpErrorResponse } from '@angular/common/http';
import { MonoTypeOperatorFunction, catchError, throwError } from 'rxjs';
import { MensagensService } from '../services/mensagens/mensagens.service';

/** Mensagem legível para o usuário: diz o que não deu certo e, quando dá, por quê. */
export function mensagemDeFalha(acao: string, erro: unknown): string {
  const status = erro instanceof HttpErrorResponse ? erro.status : undefined;

  if (status === 0) {
    return `Não foi possível ${acao}: sem conexão com o servidor.`;
  }
  return status ? `Não foi possível ${acao} (erro ${status}).` : `Não foi possível ${acao}.`;
}

/** Avisa o usuário quando a requisição falha e repassa o erro para quem chamou. */
export function avisarFalha<T>(mensagens: MensagensService, acao: string): MonoTypeOperatorFunction<T> {
  return catchError(erro => {
    mensagens.erro(mensagemDeFalha(acao, erro));
    return throwError(() => erro);
  });
}
