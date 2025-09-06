import { Component, Input } from '@angular/core';
import { CentroCusto } from 'src/app/models/Centro-Custo';
import { Lancamento } from 'src/app/models/Lancamento';
import { CentroCustoService } from 'src/app/services/cetro-custo/centro-custo.service';
import { LancamentoService } from 'src/app/services/lancamento/lancamento.service';

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

  constructor(private lancamentoService: LancamentoService, private centroCustoService: CentroCustoService) {
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
}
