import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
import { mascararMoeda } from 'src/app/utils/moeda';

/** Máscara de moeda: quem digita só informa números e os dois últimos viram centavos. */
@Directive({
  selector: 'input[appMoeda]',
  host: { inputmode: 'numeric', autocomplete: 'off' }
})
export class MoedaDirective {
  private campo = inject<ElementRef<HTMLInputElement>>(ElementRef).nativeElement;
  private controle = inject(NgControl, { optional: true });

  @HostListener('input')
  aoDigitar(): void {
    const formatado = mascararMoeda(this.campo.value);
    this.campo.value = formatado;
    this.controle?.control?.setValue(formatado, { emitEvent: false });
  }
}
