import { NgFor } from '@angular/common';
import { TemplateBindingParseResult } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { GastosCentroCusto } from 'src/app/Gastos-Centro-Custo';
import { GastosMensais } from 'src/app/Gastos-Mensais';
import { DetalhamentoGastosCentroCustoService } from 'src/app/services/detalhamento-gastos-centro-custo.service';
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
  //mesSelecionado: any;
  valor: any[] = [];
  mesAno?: string = "";
  public chart: any;

  //Gráfico Gastos por Centro de Custo
  public gastosCentroCusto: GastosCentroCusto[] = [];
  private chartInfoCC: any;
  dataCC: any[] = [];
  valorCC: any[] = [];
  descricaoCC: any[] = [];
  public chartCC: any;

  //Detalhamento GastosCentroCusto
  detalhamentoGastosCC: any[] = [];
  


  constructor(private saldoService: GastosMensaisService, private gastosCentroCustoService: GastosCentroCustoService, private detalhamentoGastosCentroCusto: DetalhamentoGastosCentroCustoService) {
    //Chart.register(...registerables);
  }  

  //@ViewChild("meuCanvas", { static: true }) elemento: ElementRef | undefined;
  ngOnInit(): void {  
    
    this.mesAno = this.trataMesAnoAtual();
    
    this.buscarInformacoes();  
    this.buscarInformacoesGraficoCentroCusto(this.mesAno);
    
  }

  //Grafico Gastos Mensais
  createChart(mes: any, valor: any){
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
        beforeEvent: (chart, args, pluginOptions) => {
          const event = args.event;
          if (event.type === 'click') {
            this.chartCC.destroy();
            let _mesAno = chart.tooltip?.title.toString();            
            this.buscarInformacoesGraficoCentroCusto(_mesAno);
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
      },
      // events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
      plugins: [{
        id: 'myEventCatcher',
        beforeEvent: (chart, args, pluginOptions) => {
          const event = args.event;
          if (event.type === 'click') {
            let desCC = chart.tooltip?.title.toString();
            console.log(desCC);
            this.buscarDetalhamentoGastosCentroCusto(this.mesAno, desCC);
          }
        }
      }]
    });
  }

  buscarInformacoesGraficoCentroCusto(mesAno?: string){
    this.mesAno = mesAno;
    //this.chartCC.destroy();
    this.gastosCentroCustoService.getAllGastosCentroMesAno(mesAno).subscribe(item => {
      this.chartInfoCC = item;
      this.valorCC = [];
      this.descricaoCC = [];
      
      if (this.chartInfoCC != null) {
        for (let i = 0; i < this.chartInfoCC.length; i++) {
          
          this.valorCC.push(this.chartInfoCC[i].valor);
          this.descricaoCC.push(this.chartInfoCC[i].descricao);
        }
        this.criaGraficoGastosCentroCusto(this.descricaoCC, this.valorCC);
        this.buscarDetalhamentoGastosCentroCusto(this.mesAno, [...this.descricaoCC].pop());
        //this.chartCC.update();
        
      }
    });
    
  }

  trataMesAnoAtual(){
    let dataAtual = new Date().toLocaleDateString('pt-BR');
    let mes: string = dataAtual.toString().substring(3,5);
    let ano: string = dataAtual.toString().substring(6,10);

    switch(mes) { 
      case "01": { 
        mes = "Janeiro"; 
         break; 
      } 
      case "02": { 
         mes = "Fevereiro"; 
         break; 
      } 
      case "03": { 
          mes = "Março";  
        break; 
        }
        case "04": { 
          mes = "Abril";  
          break; 
      }
      case "05": { 
        mes = "Maio"; 
        break; 
      }
      case "06": { 
        mes = "Junho";
        break; 
      }
      case "07": { 
        mes = "Julho"; 
      break; 
      }
      case "08": { 
        mes = "Agosto"; 
        break; 
      }
      case "09": { 
        mes = "Setembro";  
      break; 
      }
      case "10": { 
        mes = "Outubro";  
      break; 
      }
      case "11": { 
        mes = "Novembro";  
      break; 
      }
      case "12": { 
        mes = "Dezembro"; 
      break; 
      } 
      
   }
   const mesAno: string = mes + " - " + ano;
   return mesAno;
    
  }

  buscarDetalhamentoGastosCentroCusto(mesAno?: string, desCC?: string){
    this.detalhamentoGastosCentroCusto.getAllDetalhamentoGastosCentroMesAno(mesAno, desCC).subscribe(item => {
      const infoDetalhamento = item;
      this.detalhamentoGastosCC = [];
      if (infoDetalhamento != null) {
        for (let i = 0; i < infoDetalhamento.length; i++) {          
          //this.valorCC.push(infoDetalhamento[i].valor);
          //this.descricaoCC.push(infoDetalhamento[i].descricao);
          this.detalhamentoGastosCC.push(infoDetalhamento[i])
        }
        console.log(this.detalhamentoGastosCC);        
      }
    });
  }

}
