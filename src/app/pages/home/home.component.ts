import { Component } from '@angular/core';
import { Lancamento } from 'src/app/Lancamento';
import { LancamentoService } from 'src/app/services/lancamento.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  lancamentos: Lancamento[] = [];

  constructor(private lancamentoService: LancamentoService) {
  }

  ngOnInit(): void {
    this.lancamentoService.getAllLancamentos().subscribe((lancamentos) => (this.lancamentos = lancamentos));
  }

  removerLancamento(id: Number): void {
    console.log("Id: " + id)
    this.lancamentoService.excluirLancamento(id).subscribe();
  }
}
