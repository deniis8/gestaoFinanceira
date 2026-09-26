import { Injectable, signal } from '@angular/core';

export type TipoToast = 'sucesso' | 'erro' | 'aviso';

export interface Toast {
  id: number;
  tipo: TipoToast;
  texto: string;
}

export interface Confirmacao {
  titulo: string;
  texto: string;
  confirmar: string;
  /** Quando ausente, o diálogo é só um aviso com um botão. */
  cancelar?: string;
  perigo?: boolean;
  resolver: (confirmado: boolean) => void;
}

/** Avisos rápidos (toasts) e diálogos de confirmação; o FeedbackHostComponent desenha os dois. */
@Injectable({
  providedIn: 'root'
})
export class MensagensService {
  readonly toasts = signal<Toast[]>([]);
  readonly confirmacao = signal<Confirmacao | null>(null);
  private sequencia = 0;

  sucesso(texto: string): void {
    this.adicionar('sucesso', texto, 3500);
  }

  erro(texto: string): void {
    this.adicionar('erro', texto, 7000);
  }

  aviso(texto: string): void {
    this.adicionar('aviso', texto, 5000);
  }

  descartar(id: number): void {
    this.toasts.update(lista => lista.filter(toast => toast.id !== id));
  }

  confirmar(opcoes: { titulo: string; texto: string; confirmar: string; perigo?: boolean }): Promise<boolean> {
    return new Promise(resolver => {
      this.confirmacao.set({ ...opcoes, cancelar: 'Cancelar', resolver });
    });
  }

  alertar(titulo: string, texto: string): Promise<boolean> {
    return new Promise(resolver => {
      this.confirmacao.set({ titulo, texto, confirmar: 'Entendi', resolver });
    });
  }

  responder(confirmado: boolean): void {
    const atual = this.confirmacao();
    this.confirmacao.set(null);
    atual?.resolver(confirmado);
  }

  private adicionar(tipo: TipoToast, texto: string, duracaoMs: number): void {
    const id = ++this.sequencia;
    this.toasts.update(lista => [...lista.slice(-2), { id, tipo, texto }]);
    setTimeout(() => this.descartar(id), duracaoMs);
  }
}
