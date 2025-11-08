import { Component } from '@angular/core';
import { CentroCustoService } from 'src/app/services/cetro-custo/centro-custo.service';
import { CentroCusto } from 'src/types';

@Component({
  selector: 'app-tabela-centro-custo',
  templateUrl: './tabela-centro-custo.component.html',
  styleUrl: './tabela-centro-custo.component.css',
  standalone: false
})
export class TabelaCentroCustoComponent {
  centroCustos: CentroCusto[] = [];
  
  constructor(private centroCustoService: CentroCustoService) {
  }

  ngOnInit(): void {
    this.centroCustoService.getAllCentroCustos().subscribe((centroCustos) => (this.centroCustos = centroCustos));
  }

  removerCentroCusto(id: Number): void {
    this.centroCustoService.excluirCentroCusto(id).subscribe();
  }
}
