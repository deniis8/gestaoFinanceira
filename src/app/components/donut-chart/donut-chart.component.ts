import { Component } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.css'],
  standalone: false
})
export class DonutChartComponent {
  saldo = 70;
  gastos = 30;

  public donutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      }
    }
  };

  public donutChartData: ChartData<'doughnut'> = {
    labels: ['Saldo', 'Gastos'],
    datasets: [
      {
        data: [this.saldo, this.gastos],
        backgroundColor: ['#28a745', '#dc3545'],
        hoverBackgroundColor: ['#218838', '#c82333']
      }
    ]
  };
}
