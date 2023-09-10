import { NgFor } from '@angular/common';
import { TemplateBindingParseResult } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { GastosMensais } from 'src/app/Gastos-Mensais';
import { GastosMensaisService } from 'src/app/services/gastos-mensais.service';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit {
  
  public gastosMensais: GastosMensais[] = [];
  private chartInfo: any;
  mes: any[] = [];
  valor: any[] = [];

  public chart: any;

  constructor(private saldoService: GastosMensaisService) {
    //Chart.register(...registerables);
  }  

  //@ViewChild("meuCanvas", { static: true }) elemento: ElementRef | undefined;
  ngOnInit(): void {    

    this.buscarInformacoes();   
    
  }

  createChart(mes: any, valor: any){
    console.log(this.mes);
    console.log(this.valor);
    this.chart = new Chart("MyChart", {
      type: 'bar',
      data: {
        labels: mes,
        datasets: [{
          label: 'Gastos Mensais',
          data: valor,
          borderWidth: 1
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

}
