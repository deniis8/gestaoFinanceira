import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import { ClimaAmbiente } from 'src/app/Clima-Ambiente';
import { ClimaAmbienteService } from 'src/app/services/clima-ambiente.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-clima-ambiente',
  templateUrl: './clima-ambiente.component.html',
  styleUrls: ['./clima-ambiente.component.css']
})
export class ClimaAmbienteComponent {
  public climaAmbiente: ClimaAmbiente[] = [];
  private chartInfo: any;
  dataHora: any[] = [];
  dataHoraCabecalho: any[] = [];
  temperatura: any[] = [];
  humidade: any[] = [];

  public chart: any;

  constructor(private climaAmbienteService: ClimaAmbienteService) {
    //Chart.register(...registerables);
  }  

  //@ViewChild("meuCanvas", { static: true }) elemento: ElementRef | undefined;
  ngOnInit(): void {   
    this.buscarInformacoes();
    /*setInterval(() =>{
      this.buscarInformacoes()
    },5000);*/
       
    
  }

  createChart(dataHora: any, temperatura: any, humidade: any){
    console.log(this.dataHora);
    console.log(this.temperatura);
    console.log(this.humidade);
    this.chart = new Chart("ChartBar", {
      type: 'bar',
      data: {
        labels: dataHora,
        datasets: [
          {
            label: 'Humidade',
            data: humidade,
            borderColor: '#006400',
            backgroundColor: '#006400',
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Clima Ambiente'
          }
        }
      },
    });    
  }

  createChartHumidade(dataHora: any, temperatura: any, humidade: any){
    console.log(this.dataHora);
    console.log(this.temperatura);
    console.log(this.humidade);
    this.chart = new Chart("ChartLine", {
      type: 'bar',
      data: {
        labels: dataHora,
        datasets: [
          {
            label: 'Temperatura',
            data: temperatura,
            borderColor: '#D2691E',
            backgroundColor: '#D2691E',
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Clima Ambiente'
          }
        }
      },
    });
  }

  buscarInformacoes(){
    this.climaAmbienteService.getClimaAmbienteService().subscribe(item => {
      this.chartInfo = item;
      if (this.chartInfo != null) {
        for (let i = 0; i < this.chartInfo.length; i++) {
          this.dataHora.push(moment(this.chartInfo[i].dataHora).format('DD/MM HH:mm'));
          this.dataHoraCabecalho.push(moment(this.chartInfo[i].dataHora).format('DD/MM/YYYY HH:mm'));
          this.temperatura.push(this.chartInfo[i].temperatura);
          this.humidade.push(this.chartInfo[i].humidade);
        }
        this.createChart(this.dataHora, this.temperatura, this.humidade);
        this.createChartHumidade(this.dataHora, this.temperatura, this.humidade);
      }
    });
  }
}
