import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { PainelFinanceiroService } from 'src/app/services/painel-financeiro/painel-financeiro.service';
import { FormatValorPipe } from 'src/app/pipes/format-valor.pipe';
import { construirGeometriaLinha } from 'src/app/utils/grafico-linha';
import { EvolucaoPatrimonio } from 'src/types';

const LARGURA = 400;
const ALTURA = 132;
const PREENCHIMENTO = 10;

interface Opcao {
  meses: number | null;
  rotulo: string;
}

/** Patrimônio de um mês: o caixa líquido mais o que já está guardado em investimento. */
const total = (ponto: EvolucaoPatrimonio): number => ponto.saldoFinal + ponto.investimentoAcumulado;

/**
 * Hero da tela Gráficos: o patrimônio de fechamento mês a mês — líquido (tabela SALDOS,
 * que os triggers do banco já mantêm) mais o acumulado em investimento, para que aportar
 * numa reserva não pareça "gastar" o dinheiro. Linha desenhada à mão, sem biblioteca de
 * gráfico. Toque num ponto para ver o patrimônio e a variação daquele mês.
 */
@Component({
  selector: 'app-patrimonio-chart',
  imports: [FormatValorPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './patrimonio-chart.component.html',
  styleUrl: './patrimonio-chart.component.css'
})
export class PatrimonioChartComponent {
  private painelFinanceiro = inject(PainelFinanceiroService);

  protected readonly largura = LARGURA;
  protected readonly altura = ALTURA;
  protected readonly opcoes: Opcao[] = [
    { meses: 6, rotulo: '6M' },
    { meses: 12, rotulo: '12M' },
    { meses: 24, rotulo: '24M' },
    { meses: null, rotulo: 'Tudo' },
  ];

  rangeMeses = signal<number | null>(12);
  pontos = signal<EvolucaoPatrimonio[]>([]);
  carregando = signal(true);
  falhou = signal(false);
  selecionado = signal<number | null>(null);

  geometria = computed(() => construirGeometriaLinha(this.pontos().map(total), LARGURA, ALTURA, PREENCHIMENTO));

  /** Um item por mês: coordenadas absolutas do SVG (círculo) e a posição em % (alvo de toque em HTML). */
  pontosInterativos = computed(() => {
    const geo = this.geometria().pontos;
    return this.pontos().map((ponto, indice) => ({
      ponto,
      indice,
      x: geo[indice]?.x ?? LARGURA / 2,
      y: geo[indice]?.y ?? ALTURA / 2,
      pctX: geo[indice] ? (geo[indice].x / LARGURA) * 100 : 0
    }));
  });

  /** Evita lotar o eixo: no máximo ~6 rótulos, sempre incluindo o primeiro e o último mês. */
  indicesComRotulo = computed(() => {
    const total = this.pontos().length;
    if (total <= 6) {
      return new Set(Array.from({ length: total }, (_, i) => i));
    }
    const passo = Math.ceil(total / 5);
    const indices = new Set<number>();
    for (let i = 0; i < total; i += passo) {
      indices.add(i);
    }
    indices.add(total - 1);
    return indices;
  });

  /** Índice em destaque: o escolhido por toque, ou o último mês por padrão. */
  indiceExibido = computed(() => this.selecionado() ?? this.pontos().length - 1);
  pontoExibido = computed(() => this.pontos()[this.indiceExibido()] ?? null);
  private pontoAnterior = computed(() => {
    const indice = this.indiceExibido();
    return indice > 0 ? this.pontos()[indice - 1] : null;
  });
  variacao = computed(() => {
    const atual = this.pontoExibido();
    const anterior = this.pontoAnterior();
    return atual && anterior ? total(atual) - total(anterior) : null;
  });

  constructor() {
    this.atualizar();
  }

  atualizar(): void {
    this.carregando.set(true);
    this.falhou.set(false);

    this.painelFinanceiro.getEvolucaoPatrimonio(this.rangeMeses() ?? undefined).subscribe({
      next: pontos => {
        this.pontos.set(pontos ?? []);
        this.selecionado.set(null);
        this.carregando.set(false);
      },
      error: () => {
        this.falhou.set(true);
        this.carregando.set(false);
      }
    });
  }

  selecionarRange(meses: number | null): void {
    if (meses === this.rangeMeses()) {
      return;
    }
    this.rangeMeses.set(meses);
    this.atualizar();
  }

  selecionarPonto(indice: number): void {
    this.selecionado.set(indice === this.indiceExibido() ? null : indice);
  }

  /** Exposto ao template: patrimônio total de um ponto (líquido + investido). */
  protected patrimonioTotal(ponto: EvolucaoPatrimonio): number {
    return total(ponto);
  }
}
