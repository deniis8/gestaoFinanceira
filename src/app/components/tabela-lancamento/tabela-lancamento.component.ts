import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EMPTY, switchMap } from 'rxjs';
import { CentroCustoService } from 'src/app/services/cetro-custo/centro-custo.service';
import { ConfiguracoesIaService } from 'src/app/services/configuracoes-ia/configuracoes-ia.service';
import { LancamentoService } from 'src/app/services/lancamento/lancamento.service';
import { AnaliseFinanceiraIaResponse, CentroCusto, Lancamento } from 'src/types';

@Component({
  selector: 'app-tabela-lancamento',
  templateUrl: './tabela-lancamento.component.html',
  styleUrl: './tabela-lancamento.component.css',
  standalone: false
})
export class TabelaLancamentoComponent {
  lancamentos: Lancamento[] = [];
  centroCustos: CentroCusto[] = [];
  dataDe: string = this.getDataDiasAtras(30);
  dataAte: string = this.getHoje();

  isAPagarChecked = true;
  isPagoChecked = true;
  isAReceberChecked = true;
  isRecebidoChecked = true;

  aPagar = "";
  pago = "";
  aReceber = "";
  recebido = ""

  filtroStatus = "";

  filtroCentroCusto = 0;

  @Input() saldoValoresSelecionados: number = 0;
  @Input() despesasGraficoDonut: number = 0;
  @Input() receitasGraficoDonut: number = 0;
  private idsInvalidos = new Set([19, 51]);

  htmlIa?: SafeHtml;
  isPopupAberto = false;
  isLoadingInsight = false;

  constructor(private lancamentoService: LancamentoService,
    private centroCustoService: CentroCustoService,
    private configuracoesIAService: ConfiguracoesIaService,
    private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.filtroStatus = this.agrupaStatus();
    this.lancamentoService.getLancamentoDataDeAte(this.dataDe, this.dataAte, this.filtroStatus, this.filtroCentroCusto).subscribe((lancamentos) => {
      if (lancamentos != null) {
        for (let i = 0; i < lancamentos.length; i++) {
          this.lancamentos.push(lancamentos[i]);
          this.saldoValoresSelecionados += lancamentos[i].valor;
          if (this.lancamentos[i].status === "Pago" && !this.idsInvalidos.has(this.lancamentos[i].idCCusto)) {
            this.despesasGraficoDonut += lancamentos[i].valor;
          }
          if (this.lancamentos[i].status === "Recebido") {
            this.receitasGraficoDonut += lancamentos[i].valor;
          }
        }
      }
    });

    this.centroCustoService.getAllCentroCustos().subscribe((centroCustos) => (this.centroCustos = centroCustos));
  }

  getHoje(): string {
    const hoje = new Date();
    return hoje.toISOString().substring(0, 10);
  }

  getDataDiasAtras(dias: number): string {
    const data = new Date();
    data.setDate(data.getDate() - dias);
    return data.toISOString().substring(0, 10);
  }

  filtrarCentroCusto(event: Event): void {
    this.filtroCentroCusto = parseInt((event.target as HTMLSelectElement).value, 10);
    this.filtroData();
  }

  filtroData(): void {

    this.saldoValoresSelecionados = 0;
    this.despesasGraficoDonut = 0;
    this.receitasGraficoDonut = 0;
    this.filtroStatus = this.agrupaStatus();

    if (this.dataDe != "" && this.dataAte != "") {
      this.lancamentoService.getLancamentoDataDeAte(this.dataDe, this.dataAte, this.filtroStatus, this.filtroCentroCusto).subscribe(item => {
        this.lancamentos = [];
        this.lancamentos = item;
        if (this.lancamentos != null) {
          for (let i = 0; i < this.lancamentos.length; i++) {
            this.saldoValoresSelecionados += this.lancamentos[i].valor;

            if (this.lancamentos[i].status === "Pago" && !this.idsInvalidos.has(this.lancamentos[i].idCCusto)) {
              this.despesasGraficoDonut += this.lancamentos[i].valor;
            }
            if (this.lancamentos[i].status === "Recebido") {
              this.receitasGraficoDonut += this.lancamentos[i].valor;
            }
          }
        }
      });
    }
  }

  agrupaStatus(): string {
    this.filtroStatus = "";
    this.aPagar = this.isAPagarChecked ? "A Pagar" : "";
    this.pago = this.isPagoChecked ? "Pago" : "";
    this.aReceber = this.isAReceberChecked ? "A Receber" : "";
    this.recebido = this.isRecebidoChecked ? "Recebido" : "";

    return this.aPagar + this.pago + this.aReceber + this.recebido;
  }

  removerLancamento(id: Number): void {
    this.lancamentoService.excluirLancamento(id).subscribe();
  }

  abrirInsight(event?: MouseEvent) {
    event?.stopPropagation();

    // Se já estiver carregando, ignora clique
    if (this.isLoadingInsight) return;

    this.isLoadingInsight = true;
    this.htmlIa = undefined;

    this.configuracoesIAService.getConfiguracaoIA()
      .pipe(
        switchMap(item => {
          if (!item) {
            this.isLoadingInsight = false;
            return EMPTY;
          }

          return this.configuracoesIAService.postAnaliseFinanceiraIa(
            this.formatarData(item.filtroDataDe),
            this.formatarData(item.filtroDataAte),
            item.prompt
          );
        })
      )
      .subscribe({
        next: (res: AnaliseFinanceiraIaResponse) => {
          this.htmlIa = this.sanitizer
            .bypassSecurityTrustHtml(res.analiseIA);

          this.isPopupAberto = true;
          this.isLoadingInsight = false;
        },
        error: (error) => {
          this.isLoadingInsight = false;
          console.error('Erro ao gerar análise IA', error);
        }
      });
  }


  formatarData(data: string | Date): string {
    if (!data) return '';

    const d = new Date(data);
    return d.toISOString().split('T')[0];
  }

  fecharPopup() {
    this.isPopupAberto = false;
  }
}
