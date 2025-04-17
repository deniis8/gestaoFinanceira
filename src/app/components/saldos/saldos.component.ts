import { Component } from '@angular/core';
import { Saldo } from 'src/app/models/Saldo';
import { SaldoService } from 'src/app/services/saldo/saldo.service';

@Component({
    selector: 'app-saldos',
    templateUrl: './saldos.component.html',
    styleUrls: ['./saldos.component.css'],
    standalone: false
})
export class SaldosComponent {
  saldo!: Saldo;

  constructor(private saldoService: SaldoService) {
  }

  ngOnInit(): void {
    this.saldoService.getSaldos().subscribe((item) => {
      this.saldo = item;
      console.log(this.saldo)
    })
  }
}
