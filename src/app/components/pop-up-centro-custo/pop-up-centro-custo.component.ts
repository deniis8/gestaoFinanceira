import { DatePipe } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FormatValorPipe } from 'src/app/pipes/format-valor.pipe';
import { IconComponent } from 'src/app/shared/icon/icon.component';
import { SheetComponent } from 'src/app/shared/sheet/sheet.component';
import { DetalhamentoGastosCentroCusto } from 'src/types';

/** Lançamentos pagos de um centro de custo em um mês, com editar e excluir. */
@Component({
  selector: 'app-pop-up-centro-custo',
  imports: [DatePipe, RouterLink, FormatValorPipe, IconComponent, SheetComponent],
  templateUrl: './pop-up-centro-custo.component.html',
  styleUrl: './pop-up-centro-custo.component.css'
})
export class PopUpCentroCustoComponent {
  titulo = input.required<string>();
  mesAno = input.required<string>();
  itens = input.required<DetalhamentoGastosCentroCusto[]>();

  fechar = output<void>();
  excluir = output<DetalhamentoGastosCentroCusto>();

  expandido = signal<number | null>(null);

  total = computed(() => this.itens().reduce((soma, item) => soma + item.valor, 0));

  alternar(id: number): void {
    this.expandido.update(atual => (atual === id ? null : id));
  }
}
