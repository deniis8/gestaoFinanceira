import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ROTULO_STATUS, STATUS, ehPendente, ehSaida } from 'src/app/core/constantes';
import { FormatValorPipe } from 'src/app/pipes/format-valor.pipe';
import { CentroCustoService } from 'src/app/services/cetro-custo/centro-custo.service';
import { LancamentoFixoService } from 'src/app/services/lancamento-fixo/lancamento-fixo.service';
import { MensagensService } from 'src/app/services/mensagens/mensagens.service';
import { IconComponent } from 'src/app/shared/icon/icon.component';
import { formatarValor } from 'src/app/utils/moeda';
import { CentroCusto, LancamentoFixo } from 'src/types';

@Component({
  selector: 'app-tabela-lancamento-fixo',
  imports: [RouterLink, FormatValorPipe, IconComponent],
  templateUrl: './tabela-lancamento-fixo.component.html',
  styleUrl: './tabela-lancamento-fixo.component.css'
})
export class TabelaLancamentoFixoComponent implements OnInit {
  private lancamentoFixoService = inject(LancamentoFixoService);
  private centroCustoService = inject(CentroCustoService);
  private mensagens = inject(MensagensService);

  lancamentosFixos = signal<LancamentoFixo[]>([]);
  centroCustos = signal<CentroCusto[]>([]);
  carregando = signal(true);
  expandido = signal<number | null>(null);

  /** Ordenados pelo dia do mês em que caem. */
  ordenados = computed(() =>
    [...this.lancamentosFixos()].sort((a, b) => a.diaMes - b.diaMes || a.descricao.localeCompare(b.descricao))
  );

  totais = computed(() => {
    let aPagar = 0;
    let aReceber = 0;
    for (const item of this.lancamentosFixos()) {
      if (item.status === STATUS.aPagar) aPagar += item.valor;
      if (item.status === STATUS.aReceber) aReceber += item.valor;
    }
    return { aPagar, aReceber };
  });

  ngOnInit(): void {
    this.lancamentoFixoService.getAllLancamentosFixos().subscribe({
      next: lista => {
        this.lancamentosFixos.set(lista ?? []);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false)
    });

    this.centroCustoService.getAllCentroCustos().subscribe({
      next: lista => this.centroCustos.set(lista ?? []),
      error: () => undefined
    });
  }

  nomeDoCentro(item: LancamentoFixo): string {
    return item.descriCCusto ?? this.centroCustos().find(c => c.id === item.idCCusto)?.descriCCusto ?? '';
  }

  alternar(id: number): void {
    this.expandido.update(atual => (atual === id ? null : id));
  }

  rotulo(status: string): string { return ROTULO_STATUS[status] ?? status; }
  pendente(item: LancamentoFixo): boolean { return ehPendente(item.status); }
  saida(item: LancamentoFixo): boolean { return ehSaida(item.status); }

  async excluir(item: LancamentoFixo): Promise<void> {
    const confirmado = await this.mensagens.confirmar({
      titulo: 'Excluir lançamento fixo?',
      texto: `“${item.descricao}”, de R$ ${formatarValor(item.valor)}, deixa de ser lançado todo dia ${item.diaMes}.`,
      confirmar: 'Excluir',
      perigo: true
    });
    if (!confirmado || item.id == null) {
      return;
    }

    this.lancamentoFixoService.excluirLancamentoFixo(item.id).subscribe({
      next: () => {
        this.lancamentosFixos.update(lista => lista.filter(l => l.id !== item.id));
        this.expandido.set(null);
        this.mensagens.sucesso('Lançamento fixo excluído.');
      },
      error: () => undefined
    });
  }
}
