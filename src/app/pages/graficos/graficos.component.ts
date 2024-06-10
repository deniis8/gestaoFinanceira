import { Component, OnInit } from '@angular/core';
import Chart, { registerables } from 'chart.js/auto';
import { DetalhamentoGastosCentroCustoService } from 'src/app/services/detalhamento-gastos-centro-custo.service';
import { GastosCentroCustoService } from 'src/app/services/gastos-centro-custo.service';
import { GastosMensaisService } from 'src/app/services/gastos-mensais.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';


@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit {
  
  //Variáveis grafico Gastos Mensais
  private gGMLabelMes: any[] = [];
  private gGMDataValor: any[] = [];
  private gGMMesAnoAuxiliar?: string = "";
  public gGMChart: any;

  //Variáveis gráfico Gastos por Centro de Custo
  private chartInfoCC: any;
  private gGCCValor: any[] = [];
  private gGCCValorMesAnterior: any[] = [];
  private gGCCDescricao: any[] = [];
  private gGCCmesAnoAtual: any[] = []; 
  private gGCCmesAnoAnterior: any[] = []; 
  public gGCCChart: any;

  //Detalhamento GastosCentroCusto
  detalhamentoGastosCC: any[] = [];

  constructor(private saldoService: GastosMensaisService, private gastosCentroCustoService: GastosCentroCustoService, private detalhamentoGastosCentroCusto: DetalhamentoGastosCentroCustoService) {
    //Chart.register(...registerables);
  }  

  //@ViewChild("meuCanvas", { static: true }) elemento: ElementRef | undefined;
  ngOnInit(): void {     
    this.gGMMesAnoAuxiliar = this.trataMesAnoAtual();    
    this.buscarInformacoes();  
    this.buscarInformacoesGraficoCentroCusto(this.gGMMesAnoAuxiliar);    
  }

  //Grafico Gastos Mensais
  createChart(gGMLabelMes: any, gGMDataValor: any){
    Chart.register(...registerables);
    Chart.register(ChartDataLabels);
    this.gGMChart = new Chart("gGMChart", {
      type: 'bar',
      data: {
        labels: gGMLabelMes,
        datasets: [{
          label: 'Gastos Mensais - 1 Ano',
          data: gGMDataValor,
          borderWidth: 1,
          backgroundColor: '#778899'
        }]
      },
      options: {
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: '#555555',
            font: {
              weight: 'bold',
              size: 8
            },
            formatter: function(value: any) {
              return value;
            }
          },
          tooltip: {
            enabled: false // Desativa o tooltip
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        },
        onClick: (event: any) => {
          const points = this.gGMChart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);

          if (points.length) {
            const firstPoint = points[0];
            const datasetIndex = firstPoint.datasetIndex;
            const index = firstPoint.index;

            const mesAno = this.gGMChart.data.labels[index];
            //const value = this.gGMChart.data.datasets[datasetIndex].data[index];

            this.gGCCChart.destroy();
            console.log(mesAno);
            this.buscarInformacoesGraficoCentroCusto(mesAno);
          }
        }
      },
      // events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
      /*plugins: [{
        id: 'myEventCatcher',
        beforeEvent: (chart, args, pluginOptions) => {
          let event = args.event;
          if (event.type === 'click') {
            this.gGCCChart.destroy();
            let _mesAno = chart.tooltip?.title.toString();            
            this.buscarInformacoesGraficoCentroCusto(_mesAno);
          }
        }
      }]*/
    });
  }

  buscarInformacoes(){
    this.saldoService.getGastosMensais().subscribe(item => {
      if (item != null) {
        for (let i = 0; i < item.length; i++) {
          this.gGMLabelMes.push(item[i].mes + " - " + item[i].ano);
          this.gGMDataValor.push(item[i].valor);
        }
        this.createChart(this.gGMLabelMes, this.gGMDataValor);
      }
    });
  }

  //Gráfico Gastos por Centro de Custo
  criaGraficoGastosCentroCusto(gGCCDescricao: any, gGCCValor: any, gGCCValorMesAnterior: any, gGCCmesAnoAtual: any, gGCCmesAnoAnterior: any){
    this.gGCCChart = new Chart("gGCCChart", {
      type: 'bar',
      data: {
        labels: gGCCDescricao,
        datasets: [
          {
            label: 'Mês Anterior',
            data: gGCCValorMesAnterior,
            borderWidth: 1,
            backgroundColor: '#B0C4DE'
          },
          {
          label: 'Mês atual',
          data: gGCCValor,
          borderWidth: 1,
          backgroundColor: '#778899'
        }]
      },
      options: {
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: '#555555',
            font: {
              weight: 'bold',
              size: 8
            },
            
            formatter: function(value: any) {
              return value;
            }
          },
          tooltip: {
            enabled: false // Desativa o tooltip
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        },
        onClick: (event: any) => {
          const points = this.gGCCChart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);

          if (points.length) {
            const firstPoint = points[0];
            const datasetIndex = firstPoint.datasetIndex;
            const index = firstPoint.index;

            const desCC = this.gGCCChart.data.labels[index];
            const valor = this.gGCCChart.data.datasets[datasetIndex].data[index];

            let mesAno = '';
            if (datasetIndex === 0) { // Mês Anterior
                mesAno = gGCCmesAnoAnterior[index];
            } else if (datasetIndex === 1) { // Mês Atual
                mesAno = gGCCmesAnoAtual[index];
            }

            console.log("mesAno: " + mesAno);
            console.log("desCC: " + desCC);
            console.log("valor: " + valor);


            //this.gGCCChart.destroy();
            this.buscarDetalhamentoGastosCentroCusto(mesAno, desCC);
          }
        }
      },
      // events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
      /*plugins: [{
        id: 'myEventCatcher',
        beforeEvent: (chart, args, pluginOptions) => {
          let event = args.event;
          if (event.type === 'click') {
            let desCC = chart.tooltip?.title.toString();
            //console.log(desCC);
            this.buscarDetalhamentoGastosCentroCusto(this.gGMMesAnoAuxiliar, desCC);
          }
        }
      }]*/
    });
  }

  buscarInformacoesGraficoCentroCusto(mesAno?: string){
    this.gGMMesAnoAuxiliar = mesAno;
    //this.gGCCChart.destroy();
    this.gastosCentroCustoService.getAllGastosCentroMesAno(mesAno).subscribe(item => {
      this.chartInfoCC = item;
      this.gGCCValor = [];
      this.gGCCValorMesAnterior = [];
      this.gGCCDescricao = [];
      this.gGCCmesAnoAtual = [];
      this.gGCCmesAnoAnterior = [];
      //console.log(item);
      if (this.chartInfoCC != null) {
        for (let i = 0; i < this.chartInfoCC.length; i++) {
          
          this.gGCCValor.push(this.chartInfoCC[i].valor);
          this.gGCCValorMesAnterior.push(this.chartInfoCC[i].valorMesAnterior);
          this.gGCCDescricao.push(this.chartInfoCC[i].descricao);
          this.gGCCmesAnoAtual.push(this.chartInfoCC[i].mesAno);
          this.gGCCmesAnoAnterior.push(this.chartInfoCC[i].mesAnoMesAnterior);
        }
        //console.log(this.gGCCmesAnoAtual);
        //console.log(this.gGCCmesAnoAnterior);
        this.criaGraficoGastosCentroCusto(this.gGCCDescricao, this.gGCCValor, this.gGCCValorMesAnterior, this.gGCCmesAnoAtual, this.gGCCmesAnoAnterior);
        this.buscarDetalhamentoGastosCentroCusto(this.gGMMesAnoAuxiliar, [...this.gGCCDescricao].pop());
        //this.gGCCChart.update();
        
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
   let mesAno: string = mes + " - " + ano;
   return mesAno;
    
  }

  buscarDetalhamentoGastosCentroCusto(mesAno?: string, desCC?: string){
    this.detalhamentoGastosCentroCusto.getAllDetalhamentoGastosCentroMesAno(mesAno, desCC).subscribe(item => {
      let infoDetalhamento = item;
      this.detalhamentoGastosCC = [];
      if (infoDetalhamento != null) {
        for (let i = 0; i < infoDetalhamento.length; i++) {        
          this.detalhamentoGastosCC.push(infoDetalhamento[i])
        }
        //console.log(this.detalhamentoGastosCC);        
      }
    });
  }

}
