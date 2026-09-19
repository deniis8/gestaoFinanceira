import { DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EMPTY, Observable, Subject, catchError, debounceTime, finalize, of, switchMap, tap } from 'rxjs';

import { PopUpIaComponent } from 'src/app/components/pop-up-ia/pop-up-ia.component';
import { SaldosComponent } from 'src/app/components/saldos/saldos.component';
import {
  COR_STATUS, IDS_CENTROS_INVESTIMENTO, NOME_CENTRO_EMPRESTIMO, ROTULO_STATUS, STATUS, ehPendente, ehSaida
} from 'src/app/core/constantes';
import { FormatValorPipe } from 'src/app/pipes/format-valor.pipe';
import { CentroCustoService } from 'src/app/services/cetro-custo/centro-custo.service';
import { ConfiguracoesIaService } from 'src/app/services/configuracoes-ia/configuracoes-ia.service';
import { LancamentoService } from 'src/app/services/lancamento/lancamento.service';
import { MensagensService } from 'src/app/services/mensagens/mensagens.service';
import { IconComponent } from 'src/app/shared/icon/icon.component';
import { SheetComponent } from 'src/app/shared/sheet/sheet.component';
import { copiarParaAreaDeTransferencia, montarTextoCopia } from 'src/app/utils/copiar-lancamentos';
import { chaveDoDia, hojeISO, rotuloDoDia } from 'src/app/utils/datas';
import { formatarValor } from 'src/app/utils/moeda';
import { CentroCusto, Lancamento } from 'src/types';

interface GrupoDia {
  chave: string;
  rotulo: string;
  itens: Lancamento[];
}

@Component({
  selector: 'app-home',
  imports: [FormsModule, DatePipe, RouterLink, IconComponent, SaldosComponent, PopUpIaComponent, SheetComponent, FormatValorPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private lancamentoService = inject(LancamentoService);
  private centroCustoService = inject(CentroCustoService);
  private configuracoesIa = inject(ConfiguracoesIaService);
  private mensagens = inject(MensagensService);
  private destroyRef = inject(DestroyRef);

  private saldos = viewChild(SaldosComponent);

  /** A ordem daqui é a ordem em que a API recebe os status concatenados. */
  readonly opcoesStatus = [
    STATUS.aPagar, STATUS.pago, STATUS.aReceber, STATUS.recebido
  ].map(valor => ({ valor: valor as string, rotulo: ROTULO_STATUS[valor], cor: COR_STATUS[valor] }));

  // filtros
  dataDe = signal('');
  dataAte = signal(hojeISO());
  statusMarcados = signal<ReadonlySet<string>>(new Set(this.opcoesStatus.map(o => o.valor)));
  idCentroCusto = signal(0);
  filtrosAbertos = signal(false);

  // dados
  centroCustos = signal<CentroCusto[]>([]);
  lancamentos = signal<Lancamento[]>([]);
  carregando = signal(true);
  falhou = signal(false);
  expandido = signal<number | null>(null);

  // copiar
  modoCopia = signal(false);
  selecionados = signal<ReadonlySet<number>>(new Set());
  textoManual = signal<string | null>(null);

  // insight de IA
  insight = signal<string | null>(null);
  carregandoInsight = signal(false);

  private disparo$ = new Subject<void>();

  statusSelecionados = computed(() => this.opcoesStatus.map(o => o.valor).filter(v => this.statusMarcados().has(v)));
  periodoInvalido = computed(() => !!this.dataDe() && !!this.dataAte() && this.dataDe() > this.dataAte());

  totais = computed(() => {
    const soma = { aPagar: 0, pago: 0, aReceber: 0, recebido: 0, despesas: 0, receitas: 0 };
    for (const l of this.lancamentos()) {
      if (l.status === STATUS.aPagar) soma.aPagar += l.valor;
      if (l.status === STATUS.pago) soma.pago += l.valor;
      if (l.status === STATUS.aReceber) soma.aReceber += l.valor;
      if (l.status === STATUS.recebido) soma.recebido += l.valor;
      if (l.status === STATUS.pago && !IDS_CENTROS_INVESTIMENTO.has(l.idCCusto)) soma.despesas += l.valor;
      if (l.status === STATUS.recebido) soma.receitas += l.valor;
    }
    return soma;
  });

  grupos = computed<GrupoDia[]>(() => {
    const ordenados = [...this.lancamentos()].sort((a, b) => +new Date(b.dataHora) - +new Date(a.dataHora));
    const porDia = new Map<string, Lancamento[]>();
    for (const l of ordenados) {
      const chave = chaveDoDia(l.dataHora);
      porDia.set(chave, [...(porDia.get(chave) ?? []), l]);
    }
    return Array.from(porDia, ([chave, itens]) => ({ chave, rotulo: rotuloDoDia(chave), itens }));
  });

  resumoDatas = computed(() => {
    const curta = (iso: string) => (iso ? iso.split('-').reverse().slice(0, 2).join('/') : 'início');
    return `${curta(this.dataDe())} a ${curta(this.dataAte())}`;
  });
  resumoStatus = computed(() => {
    const total = this.opcoesStatus.length;
    const marcados = this.statusMarcados().size;
    return marcados === total ? 'todos os status' : `${marcados} de ${total} status`;
  });

  todosSelecionados = computed(() => this.lancamentos().length > 0 && this.selecionados().size === this.lancamentos().length);
  totalSelecionado = computed(() =>
    this.lancamentos().filter(l => this.selecionados().has(l.id!)).reduce((soma, l) => soma + l.valor, 0)
  );

  constructor() {
    this.disparo$.pipe(
      debounceTime(150),
      tap(() => this.carregando.set(true)),
      switchMap(() => this.buscarFiltrado()),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(lista => {
      if (lista) {
        this.lancamentos.set(lista);
        this.expandido.set(null);
        this.selecionados.set(new Set());
      }
      this.carregando.set(false);
    });
  }

  ngOnInit(): void {
    this.carregarCiclo();

    this.centroCustoService.getAllCentroCustos().subscribe({
      next: lista => this.centroCustos.set(lista ?? []),
      error: () => undefined
    });
  }

  /** Lançamentos do ciclo atual, a mesma lista que a API devolve para a tela inicial. */
  carregarCiclo(): void {
    this.carregando.set(true);
    this.falhou.set(false);
    this.saldos()?.atualizar();

    this.lancamentoService.getAllLancamentos().subscribe({
      next: lista => {
        const itens = lista ?? [];
        this.lancamentos.set(itens);
        if (itens.length > 0) {
          const maisAntigo = itens.reduce((menor, l) => (+new Date(l.dataHora) < +new Date(menor) ? l.dataHora : menor), itens[0].dataHora);
          this.dataDe.set(chaveDoDia(maisAntigo));
        }
        this.carregando.set(false);
      },
      error: () => {
        this.carregando.set(false);
        this.falhou.set(true);
      }
    });
  }

  // ---------- filtros ----------

  /** `null` significa "não mexa na lista" (datas incompletas ou falha, que o serviço já avisou). */
  private buscarFiltrado(): Observable<Lancamento[] | null> {
    if (!this.dataDe() || !this.dataAte()) {
      return of(null);
    }
    if (this.periodoInvalido() || this.statusSelecionados().length === 0) {
      return of([]);
    }

    return this.lancamentoService.getLancamentoDataDeAte({
      dataDe: this.dataDe(),
      dataAte: this.dataAte(),
      status: this.statusSelecionados(),
      idCentroCusto: this.idCentroCusto()
    }).pipe(
      catchError(() => of(null))
    );
  }

  mudarDataDe(valor: string): void { this.dataDe.set(valor); this.aplicar(); }
  mudarDataAte(valor: string): void { this.dataAte.set(valor); this.aplicar(); }
  mudarCentroCusto(valor: number): void { this.idCentroCusto.set(valor); this.aplicar(); }

  alternarStatus(valor: string): void {
    const proximo = new Set(this.statusMarcados());
    if (proximo.has(valor)) { proximo.delete(valor); } else { proximo.add(valor); }
    this.statusMarcados.set(proximo);
    this.aplicar();
  }

  private aplicar(): void {
    this.disparo$.next();
  }

  // ---------- linhas ----------

  aoTocar(lancamento: Lancamento): void {
    if (this.modoCopia()) {
      this.alternarSelecao(lancamento.id!);
    } else {
      this.expandido.update(atual => (atual === lancamento.id ? null : lancamento.id!));
    }
  }

  corDaMarca(lancamento: Lancamento): string {
    return ehSaida(lancamento.status) ? 'var(--expense)' : 'var(--income)';
  }
  pendente(lancamento: Lancamento): boolean { return ehPendente(lancamento.status); }
  saida(lancamento: Lancamento): boolean { return ehSaida(lancamento.status); }
  emprestimo(lancamento: Lancamento): boolean { return lancamento.descriCCusto === NOME_CENTRO_EMPRESTIMO; }
  rotuloStatus(status: string): string { return ROTULO_STATUS[status] ?? status; }

  async excluir(lancamento: Lancamento): Promise<void> {
    const confirmado = await this.mensagens.confirmar({
      titulo: 'Excluir lançamento?',
      texto: `“${lancamento.descricao}”, de R$ ${formatarValor(lancamento.valor)}, será excluído.`,
      confirmar: 'Excluir',
      perigo: true
    });
    if (!confirmado || lancamento.id == null) {
      return;
    }

    this.lancamentoService.excluirLancamento(lancamento.id).subscribe({
      next: () => {
        this.lancamentos.update(lista => lista.filter(l => l.id !== lancamento.id));
        this.expandido.set(null);
        this.mensagens.sucesso('Lançamento excluído.');
        this.saldos()?.atualizar();
      },
      error: () => undefined
    });
  }

  // ---------- copiar ----------

  alternarModoCopia(): void {
    this.modoCopia.update(ativo => !ativo);
    this.selecionados.set(new Set());
    this.expandido.set(null);
  }

  alternarSelecao(id: number): void {
    const proximo = new Set(this.selecionados());
    if (proximo.has(id)) { proximo.delete(id); } else { proximo.add(id); }
    this.selecionados.set(proximo);
  }

  selecionarTodos(): void {
    this.selecionados.set(this.todosSelecionados() ? new Set() : new Set(this.lancamentos().map(l => l.id!)));
  }

  async copiarSelecionados(): Promise<void> {
    const escolhidos = this.lancamentos().filter(l => this.selecionados().has(l.id!));
    if (escolhidos.length === 0) {
      return;
    }

    const texto = montarTextoCopia(escolhidos);
    try {
      await copiarParaAreaDeTransferencia(texto);
      this.mensagens.sucesso(escolhidos.length === 1 ? 'Lançamento copiado.' : `${escolhidos.length} lançamentos copiados.`);
      this.alternarModoCopia();
    } catch {
      this.textoManual.set(texto);
    }
  }

  // ---------- insight de IA ----------

  gerarInsight(): void {
    if (this.carregandoInsight()) {
      return;
    }
    this.carregandoInsight.set(true);

    this.configuracoesIa.getConfiguracaoIA().pipe(
      switchMap(item => {
        if (!item) {
          this.mensagens.aviso('Defina o período e o prompt em Configurações da IA para gerar o insight.');
          return EMPTY;
        }
        return this.configuracoesIa.postAnaliseFinanceiraIa(chaveDoDia(item.filtroDataDe), chaveDoDia(item.filtroDataAte), item.prompt);
      }),
      finalize(() => this.carregandoInsight.set(false))
    ).subscribe({
      next: resposta => this.insight.set(resposta.analiseIA),
      error: () => undefined
    });
  }
}
