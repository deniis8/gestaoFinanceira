import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { SaldoService } from 'src/app/services/saldo/saldo.service';
import { FormatValorPipe } from 'src/app/pipes/format-valor.pipe';
import { GuilhocheComponent } from 'src/app/shared/guilhoche/guilhoche.component';
import { Saldo } from 'src/types';

/** A "nota" com o saldo e os investimentos, mais o resumo do período filtrado. */
@Component({
  selector: 'app-saldos',
  imports: [FormatValorPipe, GuilhocheComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './saldos.component.html',
  styleUrl: './saldos.component.css'
})
export class SaldosComponent {
  private saldoService = inject(SaldoService);

  valorAPagar = input(0);
  valorPago = input(0);
  valorAReceber = input(0);
  valorRecebido = input(0);
  despesasGraficoDonut = input(0);
  receitasGraficoDonut = input(0);
  isLoading = input(true);

  saldo = signal<Saldo | undefined>(undefined);
  saldoFalhou = signal(false);

  sobra = computed(() => this.receitasGraficoDonut() - this.despesasGraficoDonut());

  /** Parte da barra ocupada pelas receitas, em % (50 quando não há nada). */
  parteReceitas = computed(() => {
    const total = this.receitasGraficoDonut() + this.despesasGraficoDonut();
    return total > 0 ? (this.receitasGraficoDonut() / total) * 100 : 0;
  });
  temMovimento = computed(() => this.receitasGraficoDonut() + this.despesasGraficoDonut() > 0);

  constructor() {
    this.atualizar();
  }

  atualizar(): void {
    this.saldoService.getSaldos().subscribe({
      next: item => {
        this.saldo.set(item);
        this.saldoFalhou.set(false);
      },
      error: () => this.saldoFalhou.set(true)
    });
  }
}
