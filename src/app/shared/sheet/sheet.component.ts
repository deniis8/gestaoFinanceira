import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, output, input, viewChild } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

let proximoId = 0;

/**
 * Diálogo modal em cima do elemento nativo <dialog>: foco preso, Esc e fundo
 * escurecido vêm do navegador. No celular sobe como gaveta; no desktop fica ao centro.
 * O componente existe enquanto estiver aberto: use @if no pai.
 */
@Component({
  selector: 'app-sheet',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog #dialogo [class.pequeno]="pequeno()" [attr.aria-labelledby]="idTitulo"
            (close)="fechar.emit()" (click)="aoClicar($event)">
      <div class="painel">
        <header>
          <h2 [id]="idTitulo">{{ titulo() }}</h2>
          <button type="button" class="btn btn-quiet btn-icon btn-sm" aria-label="Fechar" (click)="dialogo.close()">
            <app-icon nome="fechar" />
          </button>
        </header>
        <div class="corpo"><ng-content /></div>
        <footer class="rodape"><ng-content select="[rodape]" /></footer>
      </div>
    </dialog>
  `,
  styleUrl: './sheet.component.css'
})
export class SheetComponent implements AfterViewInit, OnDestroy {
  titulo = input.required<string>();
  pequeno = input(false);
  fechar = output<void>();

  readonly idTitulo = `sheet-titulo-${++proximoId}`;
  private dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');

  ngAfterViewInit(): void {
    this.dialogo().nativeElement.showModal();
  }

  ngOnDestroy(): void {
    const dialogo = this.dialogo().nativeElement;
    if (dialogo.open) {
      dialogo.close();
    }
  }

  /** O painel ocupa o diálogo inteiro; um clique no próprio <dialog> é um clique no fundo. */
  aoClicar(evento: MouseEvent): void {
    if (evento.target === this.dialogo().nativeElement) {
      this.dialogo().nativeElement.close();
    }
  }
}
