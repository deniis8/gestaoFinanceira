import { NgFor } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {Chart, registerables} from 'chart.js';
import { first } from 'rxjs';
import { GastosMensais } from 'src/app/Gastos-Mensais';
import { GastosMensaisService } from 'src/app/services/gastos-mensais.service';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit{
  
  /**
   *
   */
  gastosMensais: any [] = [];
  constructor(private saldoService: GastosMensaisService) {
    Chart.register(...registerables);
    
  }

  
  @ViewChild("meuCanvas", { static: true }) elemento!: ElementRef;
  ngOnInit(): void {
    
    this.saldoService.getGastosMensais().subscribe((item) => {
      item.forEach(element => this.gastosMensais.push(element))
    })
    console.log(this.gastosMensais);
      new Chart(this.elemento.nativeElement, {
      type: 'bar',
      data: {
        labels: ["Janeiro", "Fevereiro"],
        datasets: [{
          label: 'Gastos Mensais',
          data: [2800, 3000],
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
