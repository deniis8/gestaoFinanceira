import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FormatValorPipe } from 'src/app/pipes/format-valor.pipe';
import { CentroCustoService } from 'src/app/services/cetro-custo/centro-custo.service';
import { LancamentoService } from 'src/app/services/lancamento/lancamento.service';
import { MensagensService } from 'src/app/services/mensagens/mensagens.service';
import { IconComponent } from 'src/app/shared/icon/icon.component';
import { CentroCusto } from 'src/types';

@Component({
  selector: 'app-tabela-centro-custo',
  imports: [RouterLink, FormatValorPipe, IconComponent],
  templateUrl: './tabela-centro-custo.component.html',
  styleUrl: './tabela-centro-custo.component.css'
})
export class TabelaCentroCustoComponent implements OnInit {
  private centroCustoService = inject(CentroCustoService);
  private lancamentoService = inject(LancamentoService);
  private mensagens = inject(MensagensService);

  centroCustos = signal<CentroCusto[]>([]);
  carregando = signal(true);
  expandido = signal<number | null>(null);

  ngOnInit(): void {
    this.centroCustoService.getAllCentroCustos().subscribe({
      next: lista => {
        this.centroCustos.set(lista ?? []);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false)
    });
  }

  alternar(id: number): void {
    this.expandido.update(atual => (atual === id ? null : id));
  }

  /** Um centro de custo com lançamentos não pode ser excluído. */
  excluir(centro: CentroCusto): void {
    if (centro.id == null) {
      return;
    }
    const id = centro.id;

    this.lancamentoService.getExisteCentroCusto(id).subscribe({
      next: async ({ quantidade }) => {
        if (quantidade > 0) {
          const um = quantidade === 1;
          this.mensagens.alertar(
            'Atenção',
            `Esse centro de custo não pode ser excluído, pois ${um ? 'existe' : 'existem'} ${quantidade} ${um ? 'lançamento' : 'lançamentos'} ${um ? 'atribuído' : 'atribuídos'} a ele.`
          );
          return;
        }

        const confirmado = await this.mensagens.confirmar({
          titulo: 'Excluir centro de custo?',
          texto: `“${centro.descriCCusto}” será excluído.`,
          confirmar: 'Excluir',
          perigo: true
        });
        if (!confirmado) {
          return;
        }

        this.centroCustoService.excluirCentroCusto(id).subscribe({
          next: () => {
            this.centroCustos.update(lista => lista.filter(c => c.id !== id));
            this.expandido.set(null);
            this.mensagens.sucesso('Centro de custo excluído.');
          },
          error: () => undefined
        });
      },
      error: () => undefined
    });
  }
}
