import { DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Subject, catchError, map, of, switchMap, tap } from 'rxjs';

import { PatrimonioChartComponent } from 'src/app/components/patrimonio-chart/patrimonio-chart.component';
import { PopUpCentroCustoComponent } from 'src/app/components/pop-up-centro-custo/pop-up-centro-custo.component';
import { DIA_SEMANA_COMPLETO, MESES_ABREV } from 'src/app/core/constantes';
import { FormatValorPipe } from 'src/app/pipes/format-valor.pipe';
import { DetalhamentoGastosCentroCustoService } from 'src/app/services/detalhamento-gastos-custo/detalhamento-gastos-centro-custo.service';
import { GastosCentroCustoService } from 'src/app/services/gastos-centro-custo/gastos-centro-custo.service';
import { GastosMensaisService } from 'src/app/services/gastos-mensais/gastos-mensais.service';
import { LancamentoService } from 'src/app/services/lancamento/lancamento.service';
import { MensagensService } from 'src/app/services/mensagens/mensagens.service';
import { PainelFinanceiroService } from 'src/app/services/painel-financeiro/painel-financeiro.service';
import { getColorForSobra } from 'src/app/utils/colors';
import { formatarValor } from 'src/app/utils/moeda';
import { DetalhamentoGastosCentroCusto, GastosCentroCusto, GastosMensais, NivelSaudeFinanceira, PainelMes } from 'src/types';

interface MesResumo {
  mes: string;
  abreviacao: string;
  ano: number;
  /** Texto que a API espera para buscar o mês: "Setembro - 2025". */
  mesAno: string;
  gasto: number;
  recebido: number;
  sobra: number;
  cor: string;
}

type ClasseLimite = 'ok' | 'alerta' | 'estourado';

interface CentroVisual {
  descricao: string;
  gasto: number;
  limite: number;
  mesAno: string;
  valorMesAnterior: number;
  percentual: number;
  /** Percentual arredondado, para exibir. */
  pct: number;
  classe: ClasseLimite;
}

interface DetalheAberto {
  titulo: string;
  mesAno: string;
  itens: DetalhamentoGastosCentroCusto[];
}

/** Cor semântica de cada nível de saúde financeira, reaproveitando a paleta já existente. */
const COR_NIVEL_SAUDE: Record<NivelSaudeFinanceira, string> = {
  excelente: 'var(--income)',
  saudavel: 'var(--income)',
  atencao: 'var(--pending)',
  alerta: 'var(--expense)',
};

@Component({
  selector: 'app-graficos',
  imports: [DatePipe, RouterLink, FormatValorPipe, PatrimonioChartComponent, PopUpCentroCustoComponent],
  templateUrl: './graficos.component.html',
  styleUrl: './graficos.component.css'
})
export class GraficosComponent implements OnInit {
  private gastosMensais = inject(GastosMensaisService);
  private gastosCentroCusto = inject(GastosCentroCustoService);
  private detalhamento = inject(DetalhamentoGastosCentroCustoService);
  private lancamentoService = inject(LancamentoService);
  private painelFinanceiro = inject(PainelFinanceiroService);
  private mensagens = inject(MensagensService);
  private destroyRef = inject(DestroyRef);

  /** null = todo o histórico, como a API devolve sem datas. */
  anoSelecionado = signal<number | null>(null);
  anosDisponiveis = signal<number[]>([]);

  meses = signal<MesResumo[]>([]);
  mesSelecionado = signal<string | null>(null);
  centros = signal<CentroVisual[]>([]);
  carregandoMeses = signal(true);
  carregandoCentros = signal(true);
  detalhe = signal<DetalheAberto | null>(null);

  painelMes = signal<PainelMes | null>(null);
  carregandoPainel = signal(true);
  painelFalhou = signal(false);

  mesAtual = computed(() => this.meses().find(m => m.mesAno === this.mesSelecionado()) ?? null);
  corNivelSaude = computed(() => COR_NIVEL_SAUDE[this.painelMes()?.saude.nivel ?? 'atencao']);

  /** Listas derivadas como signals próprios: dentro do template, usar `topGastos()` em vez de
   *  `(painelMes(); as painel)!.topGastos` evita um limite do compilador ao aninhar @if/@for
   *  dentro de um bloco que já usa `as` (o alias some quando ele vira a condição do bloco filho). */
  topGastos = computed(() => this.painelMes()?.topGastos ?? []);
  gastosPorDiaSemana = computed(() => this.painelMes()?.gastosPorDiaSemana ?? []);

  /** Maior valor entre os dias da semana, para escalar a altura das barras (nunca 0, evita divisão por zero). */
  maiorGastoDiaSemana = computed(() => Math.max(1, ...this.gastosPorDiaSemana().map(d => d.valorTotal)));

  /** Uma frase só quando um dia realmente se destaca dos outros — não force uma leitura em ruído. */
  insightDiaSemana = computed(() => {
    const dias = this.gastosPorDiaSemana();
    const total = dias.reduce((soma, d) => soma + d.valorTotal, 0);
    if (total === 0) {
      return null;
    }
    const maiorDia = dias.reduce((maior, d) => (d.valorTotal > maior.valorTotal ? d : maior), dias[0]);
    const media = total / dias.length;
    const nomeDia = DIA_SEMANA_COMPLETO[maiorDia.diaSemanaNum] ?? maiorDia.diaSemana;
    return maiorDia.valorTotal >= media * 1.5
      ? `${nomeDia} concentra boa parte dos seus gastos neste mês.`
      : null;
  });

  /** Parte da barra fixo x variável ocupada pelo fixo, em % (50 quando não há nenhum dos dois). */
  parteFixo = computed(() => {
    const painel = this.painelMes();
    if (!painel) { return 0; }
    const total = painel.valorFixo + painel.valorVariavel;
    return total > 0 ? (painel.valorFixo / total) * 100 : 0;
  });

  private pedidoMeses$ = new Subject<string | null>();
  private pedidoCentros$ = new Subject<string>();
  private pedidoPainel$ = new Subject<string>();

  constructor() {
    this.pedidoMeses$.pipe(
      tap(() => this.carregandoMeses.set(true)),
      switchMap(manterMes => {
        const ano = this.anoSelecionado();
        return this.gastosMensais.getGastosMensais(ano ? `${ano}-01-01` : undefined, ano ? `${ano}-12-31` : undefined).pipe(
          catchError(() => of(null)),
          map(itens => ({ itens, manterMes }))
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(({ itens, manterMes }) => {
      const meses = (itens ?? []).map(item => this.paraResumo(item));
      this.meses.set(meses);
      this.carregandoMeses.set(false);

      if (this.anoSelecionado() === null && itens && this.anosDisponiveis().length === 0) {
        this.anosDisponiveis.set([...new Set(meses.map(m => m.ano))].sort((a, b) => b - a));
      }

      if (meses.length === 0) {
        this.centros.set([]);
        this.carregandoCentros.set(false);
        return;
      }

      const alvo = manterMes && meses.some(m => m.mesAno === manterMes) ? manterMes : meses[meses.length - 1].mesAno;
      this.selecionarMes(alvo);
    });

    this.pedidoCentros$.pipe(
      tap(() => this.carregandoCentros.set(true)),
      switchMap(mesAno => this.gastosCentroCusto.getAllGastosCentroMesAno(mesAno).pipe(catchError(() => of(null)))),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(itens => {
      this.centros.set((itens ?? []).map(item => this.paraCentro(item)));
      this.carregandoCentros.set(false);
    });

    this.pedidoPainel$.pipe(
      tap(() => { this.carregandoPainel.set(true); this.painelFalhou.set(false); }),
      switchMap(mesAno => this.painelFinanceiro.getPainelMes(mesAno).pipe(catchError(() => of(null)))),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(painel => {
      this.painelMes.set(painel);
      this.painelFalhou.set(painel === null);
      this.carregandoPainel.set(false);
    });
  }

  tentarPainelDeNovo(): void {
    const mesAno = this.mesSelecionado();
    if (mesAno) {
      this.pedidoPainel$.next(mesAno);
    }
  }

  ngOnInit(): void {
    this.pedidoMeses$.next(null);
  }

  selecionarAno(ano: number | null): void {
    if (ano === this.anoSelecionado()) {
      return;
    }
    this.anoSelecionado.set(ano);
    this.meses.set([]);
    this.centros.set([]);
    this.mesSelecionado.set(null);
    this.pedidoMeses$.next(null);
  }

  selecionarMes(mesAno: string): void {
    this.mesSelecionado.set(mesAno);
    this.pedidoCentros$.next(mesAno);
    this.pedidoPainel$.next(mesAno);
  }

  abrirDetalhe(centro: CentroVisual): void {
    this.detalhamento.getAllDetalhamentoGastosCentroMesAno(centro.mesAno, centro.descricao).subscribe({
      next: itens => {
        if (itens?.length > 0) {
          this.detalhe.set({ titulo: centro.descricao, mesAno: centro.mesAno, itens });
        } else {
          this.mensagens.aviso(`Não há lançamentos em ${centro.descricao} neste mês.`);
        }
      },
      error: () => undefined
    });
  }

  async excluirDoDetalhe(item: DetalhamentoGastosCentroCusto): Promise<void> {
    const confirmado = await this.mensagens.confirmar({
      titulo: 'Excluir lançamento?',
      texto: `“${item.descricaoLancamento}”, de R$ ${formatarValor(item.valor)}, será excluído.`,
      confirmar: 'Excluir',
      perigo: true
    });
    if (!confirmado) {
      return;
    }

    this.lancamentoService.excluirLancamento(item.id).subscribe({
      next: () => {
        this.mensagens.sucesso('Lançamento excluído.');
        this.detalhe.update(atual => {
          if (!atual) { return atual; }
          const itens = atual.itens.filter(i => i.id !== item.id);
          return itens.length > 0 ? { ...atual, itens } : null;
        });
        this.pedidoMeses$.next(this.mesSelecionado());
      },
      error: () => undefined
    });
  }

  private paraResumo(item: GastosMensais): MesResumo {
    return {
      mes: item.mes,
      abreviacao: MESES_ABREV[item.mes] ?? item.mes.slice(0, 3),
      ano: item.ano,
      mesAno: `${item.mes} - ${item.ano}`,
      gasto: item.valor,
      recebido: item.valorRecebidoMes,
      sobra: item.sobraMes,
      cor: getColorForSobra(item.sobraMes)
    };
  }

  private paraCentro(item: GastosCentroCusto): CentroVisual {
    const percentual = item.valorLimite ? (item.valor / item.valorLimite) * 100 : 0;
    const classe: ClasseLimite = percentual > 100 ? 'estourado' : percentual >= 80 ? 'alerta' : 'ok';

    return {
      descricao: item.descricao,
      gasto: item.valor,
      limite: item.valorLimite,
      mesAno: item.mesAno,
      valorMesAnterior: item.valorMesAnterior,
      percentual,
      pct: Math.round(percentual),
      classe
    };
  }
}
