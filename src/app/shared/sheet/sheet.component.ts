import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, input, output, viewChild } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

let proximoId = 0;

/** Sheets abertos, do mais antigo ao mais novo: só o de cima responde ao Esc e ao Tab. */
const pilha: SheetComponent[] = [];

const FOCAVEIS = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Janela modal em cima da página (gaveta no celular, caixa ao centro no desktop).
 * Feita com elementos comuns, sem depender do <dialog> nativo, para funcionar igual em
 * qualquer navegador de celular. O componente existe enquanto estiver aberto: use @if no pai.
 */
@Component({
  selector: 'app-sheet',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fundo" (click)="fechar.emit()"></div>
    <div #painel class="painel" [class.pequeno]="pequeno()" role="dialog" aria-modal="true"
         [attr.aria-labelledby]="idTitulo" tabindex="-1">
      <header>
        <h2 [id]="idTitulo">{{ titulo() }}</h2>
        <button type="button" class="btn btn-quiet btn-icon btn-sm" aria-label="Fechar" (click)="fechar.emit()">
          <app-icon nome="fechar" />
        </button>
      </header>
      <div class="corpo"><ng-content /></div>
      <footer class="rodape"><ng-content select="[rodape]" /></footer>
    </div>
  `,
  styleUrl: './sheet.component.css',
  host: { '(document:keydown)': 'aoTeclar($event)' }
})
export class SheetComponent implements AfterViewInit, OnDestroy {
  titulo = input.required<string>();
  pequeno = input(false);
  fechar = output<void>();

  readonly idTitulo = `sheet-titulo-${++proximoId}`;
  private painel = viewChild.required<ElementRef<HTMLElement>>('painel');
  private focoAnterior: HTMLElement | null = null;

  ngAfterViewInit(): void {
    this.focoAnterior = document.activeElement as HTMLElement | null;
    pilha.push(this);
    document.documentElement.classList.add('sheet-aberto');
    this.painel().nativeElement.focus({ preventScroll: true });
  }

  ngOnDestroy(): void {
    const posicao = pilha.indexOf(this);
    if (posicao >= 0) {
      pilha.splice(posicao, 1);
    }
    if (pilha.length === 0) {
      document.documentElement.classList.remove('sheet-aberto');
    }
    this.focoAnterior?.focus?.({ preventScroll: true });
  }

  aoTeclar(evento: KeyboardEvent): void {
    if (pilha[pilha.length - 1] !== this) {
      return;
    }

    if (evento.key === 'Escape') {
      evento.preventDefault();
      this.fechar.emit();
      return;
    }

    if (evento.key === 'Tab') {
      const painel = this.painel().nativeElement;
      const focaveis = Array.from(painel.querySelectorAll<HTMLElement>(FOCAVEIS));
      if (focaveis.length === 0) {
        evento.preventDefault();
        return;
      }
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      const ativo = document.activeElement;

      if (evento.shiftKey && (ativo === primeiro || ativo === painel)) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && ativo === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      } else if (!painel.contains(ativo)) {
        evento.preventDefault();
        primeiro.focus();
      }
    }
  }
}
