import { Component } from '@angular/core';
import { CentroCusto } from 'src/app/models/Centro-Custo';
import { Lancamento } from 'src/app/models/Lancamento';
import { CentroCustoService } from 'src/app/services/centro-custo.service';
import { LancamentoService } from 'src/app/services/lancamento.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  lancamentos: Lancamento[] = [];
  centroCustos: CentroCusto[] = [];
  dataDe: string = "";
  dataAte: string = "";

  isAPagarChecked = false;
  isPagoChecked = false;
  isAReceberChecked = false;
  isRecebidoChecked = false;

  aPagar = "";
  pago = "";
  aReceber = "";
  recebido = ""

  filtroStatus = "";

  filtroCentroCusto = 0;

  constructor(private lancamentoService: LancamentoService, private centroCustoService: CentroCustoService) {
  }

  ngOnInit(): void {
    this.lancamentoService.getAllLancamentos().subscribe((lancamentos) => (this.lancamentos = lancamentos));
    this.centroCustoService.getAllCentroCustos().subscribe((centroCustos) => (this.centroCustos = centroCustos));
  }

  filtrarCentroCusto(event: Event): void {
    this.filtroCentroCusto = parseInt((event.target as HTMLSelectElement).value, 10);
    this.filtroData();
  }

  filtroData(): void {
    this.filtroStatus = "";
    if (this.isAPagarChecked) {
      this.aPagar = "A Pagar"
    } else {
      this.aPagar = ""
    }

    if (this.isPagoChecked) {
      this.pago = "Pago"
    } else {
      this.pago = ""
    }

    if (this.isAReceberChecked) {
      this.aReceber = "A Receber"
    } else {
      this.aReceber = ""
    }

    if (this.isRecebidoChecked) {
      this.recebido = "Recebido"
    } else {
      this.recebido = ""
    }

    this.filtroStatus = this.aPagar + this.pago + this.aReceber + this.recebido;
    /*console.log(this.dataDe);
    console.log(this.dataAte);
    console.log(this.filtroStatus);
    console.log(this.filtroCentroCusto);*/

    if (this.dataDe != "" && this.dataAte != "") {
      this.lancamentoService.getLancamentoDataDeAte(this.dataDe, this.dataAte, this.filtroStatus, this.filtroCentroCusto).subscribe(item => {
        let infoLancamentos = item;
        this.lancamentos = [];
        if (infoLancamentos != null) {
          for (let i = 0; i < infoLancamentos.length; i++) {
            this.lancamentos.push(infoLancamentos[i])
          }
        }
      });
    }
  }

  removerLancamento(id: Number): void {
    this.lancamentoService.excluirLancamento(id).subscribe();
  }
}
