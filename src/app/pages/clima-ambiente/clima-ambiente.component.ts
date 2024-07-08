import { Component, OnInit } from '@angular/core';
import Chart, { registerables } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ClimaAmbiente } from 'src/app/Clima-Ambiente';
import { ClimaAmbienteService } from 'src/app/services/clima-ambiente.service';

@Component({
  selector: 'app-clima-ambiente',
  templateUrl: './clima-ambiente.component.html',
  styleUrls: ['./clima-ambiente.component.css']
})
export class ClimaAmbienteComponent implements OnInit {
  public climaAmbiente: ClimaAmbiente[] = [];
  private chartInfo: any;
  dataHora: any[] = [];
  dataHoraCabecalho: any[] = [];
  temperatura: any[] = [];
  umidade: any[] = [];

  public chartUmidade: any;
  public chartTemperatura: any;

  constructor(private climaAmbienteService: ClimaAmbienteService) { }

  ngOnInit(): void {
    Chart.register(...registerables);
    Chart.register(ChartDataLabels);
    this.buscarInformacoes();
  }

  criaGraficoUmidade(dataHora: any, umidade: any) {
    this.chartUmidade = new Chart("graficoUmidade", {
      type: 'bar',
      data: {
        labels: dataHora,
        datasets: [{
          label: 'Umidade',
          data: umidade,
          borderColor: '#006400',
          backgroundColor: '#006400',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true/*,
            text: 'Clima Ambiente'*/
          },
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: '#555555',
            font: {
              weight: 'bold',
              size: 8
            },
            formatter: function (value: any) {
              return value;
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    });
  }

  criaGraficoTemperatura(dataHora: any, temperatura: any) {
    this.chartTemperatura = new Chart("graficoTemperatura", {
      type: 'bar',
      data: {
        labels: dataHora,
        datasets: [{
          label: 'Temperatura',
          data: temperatura,
          borderColor: '#D2691E',
          backgroundColor: '#D2691E',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true/*,
            text: 'Clima Ambiente'*/
          },
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: '#555555',
            font: {
              weight: 'bold',
              size: 8
            },
            formatter: function (value: any) {
              return value;
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    });
  }

  buscarInformacoes() {
    this.climaAmbienteService.getClimaAmbienteService().subscribe(item => {
      this.chartInfo = item;
      if (this.chartInfo != null) {
        for (let i = 0; i < this.chartInfo.length; i++) {
          const date = new Date(this.chartInfo[i].dataHora);
          const formattedDate = this.formatDate(date);
          this.dataHora.push(formattedDate);
          this.dataHoraCabecalho.push(this.chartInfo[i].dataHora);
          this.temperatura.push(this.chartInfo[i].temperatura);
          this.umidade.push(this.chartInfo[i].umidade);
        }
        this.criaGraficoUmidade(this.dataHora, this.umidade);
        this.criaGraficoTemperatura(this.dataHora, this.temperatura);
      }
    });
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    //return `${day}/${month}/${year} ${hours}:${minutes}`;
    return `${day}/${month} ${hours}:${minutes}`;
  }
}
