import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { DetalhamentoGastosCentroCustoService } from 'src/app/services/detalhamento-gastos-centro-custo.service';
import { GastosCentroCustoService } from 'src/app/services/gastos-centro-custo.service';
import { GastosMensaisService } from 'src/app/services/gastos-mensais.service';

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
  private gGCCDescricao: any[] = [];
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
          let event = args.event;
          if (event.type === 'click') {
            this.gGCCChart.destroy();
            let _mesAno = chart.tooltip?.title.toString();            
            this.buscarInformacoesGraficoCentroCusto(_mesAno);
          }
        }
      }]
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
  criaGraficoGastosCentroCusto(gGCCDescricao: any, gGCCValor: any){
    this.gGCCChart = new Chart("gGCCChart", {
      type: 'bar',
      data: {
        labels: gGCCDescricao,
        datasets: [{
          label: 'Top 10 - Gastos Mensal por Centro de Custo',
          data: gGCCValor,
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
          let event = args.event;
          if (event.type === 'click') {
            let desCC = chart.tooltip?.title.toString();
            //console.log(desCC);
            this.buscarDetalhamentoGastosCentroCusto(this.gGMMesAnoAuxiliar, desCC);
          }
        }
      }]
    });
  }

  buscarInformacoesGraficoCentroCusto(mesAno?: string){
    this.gGMMesAnoAuxiliar = mesAno;
    //this.gGCCChart.destroy();
    this.gastosCentroCustoService.getAllGastosCentroMesAno(mesAno).subscribe(item => {
      this.chartInfoCC = item;
      this.gGCCValor = [];
      this.gGCCDescricao = [];
      
      if (this.chartInfoCC != null) {
        for (let i = 0; i < this.chartInfoCC.length; i++) {
          
          this.gGCCValor.push(this.chartInfoCC[i].valor);
          this.gGCCDescricao.push(this.chartInfoCC[i].descricao);
        }
        this.criaGraficoGastosCentroCusto(this.gGCCDescricao, this.gGCCValor);
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
