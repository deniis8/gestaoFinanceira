import { NgFor } from '@angular/common';
import { TemplateBindingParseResult } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { GastosCentroCusto } from 'src/app/Gastos-Centro-Custo';
import { GastosMensais } from 'src/app/Gastos-Mensais';
import { GastosCentroCustoService } from 'src/app/services/gastos-centro-custo.service';
import { GastosMensaisService } from 'src/app/services/gastos-mensais.service';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit {
  
  //Grafico Gastos Mensais
  public gastosMensais: GastosMensais[] = [];
  private chartInfo: any;
  mes: any[] = [];
  mesSelecionado: any;
  valor: any[] = [];
  public chart: any;

  //Gráfico Gastos por Centro de Custo
  public gastosCentroCusto: GastosCentroCusto[] = [];
  private chartInfoCC: any;
  dataCC: any[] = [];
  valorCC: any[] = [];
  descricaoCC: any[] = [];
  public chartCC: any;

  constructor(private saldoService: GastosMensaisService, private gastosCentroCustoService: GastosCentroCustoService) {
    //Chart.register(...registerables);
  }  

  //@ViewChild("meuCanvas", { static: true }) elemento: ElementRef | undefined;
  ngOnInit(): void {    

    this.buscarInformacoes();  
    this.buscarInformacoesGraficoCentroCusto(); 
    
  }

  //Grafico Gastos Mensais
  createChart(mes: any, valor: any){
    //console.log(this.mes);
    //console.log(this.valor);
    this.chart = new Chart("MyChart", {
      type: 'bar',
      data: {
        labels: mes,
        datasets: [{
          label: 'Gastos Mensais - 1 Ano',
          data: valor,
          borderWidth: 1,
          backgroundColor: '#778899'
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
      // events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
      plugins: [{
        id: 'myEventCatcher',
        beforeEvent(chart, args, pluginOptions) {
          const event = args.event;
          if (event.type === 'click') {
            const mesSelecionado = chart.tooltip?.title.toString();
            console.log(mesSelecionado);
            //this.buscarInformacoesGraficoCentroCusto()
          }
        }
      }]
    });
  }

  buscarInformacoes(){
    this.saldoService.getGastosMensais().subscribe(item => {
      this.chartInfo = item;
      if (this.chartInfo != null) {
        for (let i = 0; i < this.chartInfo.length; i++) {
          this.mes.push(this.chartInfo[i].mes + " - " + this.chartInfo[i].ano);
          this.valor.push(this.chartInfo[i].valor);
        }
        this.createChart(this.mes, this.valor);
      }
    });
  }

  //Gráfico Gastos por Centro de Custo
  criaGraficoGastosCentroCusto(descricaoCC: any, valorCC: any){
    //console.log(this.dataCC);
    //console.log(this.valorCC);
    //console.log(this.descricaoCC);
    this.chartCC = new Chart("MyChartCC", {
      type: 'bar',
      data: {
        labels: descricaoCC,
        datasets: [{
          label: 'Top 15 - Gastos Mensal por Centro de Custo',
          data: valorCC,
          borderWidth: 1,
          backgroundColor: '#778899'
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  buscarInformacoesGraficoCentroCusto(){
    this.gastosCentroCustoService.getAllGastosCentroCustos().subscribe(item => {
      this.chartInfoCC = item;
      if (this.chartInfoCC != null) {
        for (let i = 0; i < this.chartInfoCC.length; i++) {
          //sthis.dataCC.push(this.chartInfoCC[i].dataHora);
          this.valorCC.push(this.chartInfoCC[i].valor);
          this.descricaoCC.push(this.chartInfoCC[i].descricao);
        }
        this.criaGraficoGastosCentroCusto(this.descricaoCC, this.valorCC);
      }
    });
  }

}
