import { Component, Input } from '@angular/core';
import { SaldoService } from 'src/app/services/saldo/saldo.service';
import { Saldo } from 'src/types';

@Component({
    selector: 'app-saldos',
    templateUrl: './saldos.component.html',
    styleUrls: ['./saldos.component.css'],
    standalone: false
})
export class SaldosComponent {
  @Input() saldoValoresSelecionados: number = 0;
  @Input() despesasGraficoDonut!: number;
  @Input() receitasGraficoDonut!: number;
  saldo: Saldo | undefined;

  constructor(private saldoService: SaldoService) {
  }

  ngOnInit(): void {
    this.saldoService.getSaldos().subscribe((item) => {
      this.saldo = item;
      console.log(this.saldo);
    })
  }
}
