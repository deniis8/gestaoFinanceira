import { Component } from '@angular/core';
import { CentroCusto } from 'src/app/models/Centro-Custo';
import { LancamentoFixo } from 'src/app/models/Lancamento-Fixo';
import { CentroCustoService } from 'src/app/services/cetro-custo/centro-custo.service';
import { LancamentoFixoService } from 'src/app/services/lancamento-fixo/lancamento-fixo.service';

@Component({
  selector: 'app-tabela-lancamento-fixo',
  templateUrl: './tabela-lancamento-fixo.component.html',
  styleUrl: './tabela-lancamento-fixo.component.css',
  standalone: false
})
export class TabelaLancamentoFixoComponent {
  lancamentosFixos: LancamentoFixo[] = [];
  centroCustos: CentroCusto[] = [];

  constructor(private lancamentoFixoService: LancamentoFixoService, private centroCustoService: CentroCustoService) {
  }

  ngOnInit(): void {
    this.lancamentoFixoService.getAllLancamentosFixos().subscribe((lancamentos) => (this.lancamentosFixos = lancamentos));
    this.centroCustoService.getAllCentroCustos().subscribe((centroCustos) => (this.centroCustos = centroCustos));
  }

  removerLancamento(id: Number): void {
    this.lancamentoFixoService.excluirLancamentoFixo(id).subscribe();
  }
}
