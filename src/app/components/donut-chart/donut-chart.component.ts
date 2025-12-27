import { Component, Input } from '@angular/core';
import { ChartData, ChartOptions, ChartEvent, ActiveElement } from 'chart.js';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.css'],
  standalone: false
})
export class DonutChartComponent {
  private _despesasGraficoDonut = 0;
  private _receitasGraficoDonut = 0;

  @Input() set despesasGraficoDonut(value: number){
    this._despesasGraficoDonut = value || 0;
    this.updateChartData();
  }

  @Input() set receitasGraficoDonut(value: number){
    this._receitasGraficoDonut = value || 0;
    this.updateChartData();
  }

  public donutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    cutout: '70%',
    plugins: { legend: { display: false } }
  };

  public donutChartData: ChartData<'doughnut'> = {
    labels: ['Receita', 'Gastos'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#28a745', '#dc3545'],
        hoverBackgroundColor: ['#218838', '#c82333']
      }
    ]
  };

  private updateChartData(){
    let backgroundColors: string[];
    let hoverColors: string[];

    if(this._despesasGraficoDonut > 0 && this._receitasGraficoDonut === 0){
      backgroundColors = ['#dc3545', '#dc3545'];
      hoverColors = ['#c82333', '#c82333'];
    } else if(this._receitasGraficoDonut > 0 && this._despesasGraficoDonut === 0){
      backgroundColors = ['#28a745', '#28a745'];
      hoverColors = ['#218838', '#218838'];
    } else {
      backgroundColors = ['#28a745', '#dc3545'];
      hoverColors = ['#218838', '#c82333'];
    }

    this.donutChartData = {
      ...this.donutChartData,
      datasets: [
        {
          ...this.donutChartData.datasets[0],
          data: [this._receitasGraficoDonut, this._despesasGraficoDonut],
          backgroundColor: backgroundColors,
          hoverBackgroundColor: hoverColors
        }
      ]
    };
  }

  onChartClick(event: any) {
  // Apenas abre modal se houver dados
  if (this._despesasGraficoDonut === 0 && this._receitasGraficoDonut === 0) return;

  Swal.fire({
    title: 'Detalhes',
    html: `
      <p><strong>Receita:</strong> R$ ${this._receitasGraficoDonut.toFixed(2)}</p>
      <p><strong>Gastos:</strong> R$ ${this._despesasGraficoDonut.toFixed(2)}</p>
      <p><strong>Saldo:</strong> R$ ${(this._receitasGraficoDonut - this._despesasGraficoDonut).toFixed(2)}</p>
    `,
    confirmButtonText: 'Fechar'
  });
}

}
