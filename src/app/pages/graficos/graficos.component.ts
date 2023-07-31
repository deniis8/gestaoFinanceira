import { NgFor } from '@angular/common';
import { TemplateBindingParseResult } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { first } from 'rxjs';
import { GastosMensais } from 'src/app/Gastos-Mensais';
import { GastosMensaisService } from 'src/app/services/gastos-mensais.service';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit {

  /**
   *
   */
  //public gastosMensais: GastosMensais[] = [];
  mes: string[] = [];
  valor: number[] = [];

  constructor(private saldoService: GastosMensaisService) {
    Chart.register(...registerables);

  }


  @ViewChild("meuCanvas", { static: true }) elemento!: ElementRef;
  ngOnInit(): void {

    this.saldoService.getGastosMensais().subscribe(item => {
      item.forEach(t => {
        this.mes.push(t.ano + " - " + t.mes);
        this.valor.push(t.valor);
      });
    });

    new Chart(this.elemento.nativeElement, {
      type: 'bar',
      data: {
        labels: this.mes,
        datasets: [{
          label: 'Gastos Mensais',
          data: this.valor,
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

}
