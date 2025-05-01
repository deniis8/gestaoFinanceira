import { Component } from '@angular/core';
import { CentroCusto } from 'src/app/models/Centro-Custo';
import { CentroCustoService } from 'src/app/services/cetro-custo/centro-custo.service';

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
