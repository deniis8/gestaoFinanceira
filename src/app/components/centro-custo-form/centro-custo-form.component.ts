import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CentroCustoService } from 'src/app/services/cetro-custo/centro-custo.service';
import { CentroCusto } from 'src/types';

@Component({
  selector: 'app-centro-custo-form',
  templateUrl: './centro-custo-form.component.html',
  styleUrl: './centro-custo-form.component.css',
  standalone: false
})
export class CentroCustoFormComponent implements OnInit{
  @Output() onSubmit = new EventEmitter<CentroCusto>();
  @Input() btnText!: string;
  @Input() centroCustoData: CentroCusto | null = null;
  centroCustoForm!: FormGroup;
  centroCustos: CentroCusto[] = [];

  constructor(private centroCustoService: CentroCustoService ){}

  ngOnInit(): void {
      this.centroCustoForm = new FormGroup({
        id: new FormControl(this.centroCustoData ? this.centroCustoData.id : ''),
        descriCCusto: new FormControl(this.centroCustoData ? this.centroCustoData.descriCCusto : '', [Validators.required]),
        valorLimite: new FormControl(this.centroCustoData ? this.formatValorInicial(this.centroCustoData.valorLimite) : '', [Validators.required]),
      });
  }

  get descriCCusto(){
    return this.centroCustoForm.get('descriCCusto')!;
  }

   get valorLimite(){
    return this.centroCustoForm.get('valorLimite')!;
  }

  submit(){
    if(this.centroCustoForm.invalid){
      return;
    }

    let valorFormatado = String(this.valorLimite.value)
      .replace(/\./g, '') // Remove pontos dos milhares
      .replace(',', '.'); // Troca vírgula por ponto para decimal
  
    let valorLimiteFormatado = {
      ...this.centroCustoForm.value,
      valorLimite: valorFormatado
    };

    this.onSubmit.emit(valorLimiteFormatado);
  }

  // Formata o valor inicial quando carregado da API
  formatValorInicial(valorLimite: number | string): string {
    let valorStr = valorLimite.toString().replace('.', ','); // Troca ponto por vírgula
    let partes = valorStr.split(',');
    let inteiro = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona separador de milhar
    let decimal = partes[1] ? partes[1].padEnd(2, '0') : '00'; // Garante dois dígitos nos centavos
    return `${inteiro},${decimal}`;
  }

  formatValor(): void {
    let valorLimite = this.valorLimite.value.replace(/\D/g, ''); // Remove tudo que não for número
  
    if (valorLimite.length === 0) {
      this.centroCustoForm.controls['valorLimite'].setValue('', { emitEvent: false });
      return;
    }
  
    // Remove zeros à esquerda
    valorLimite = valorLimite.replace(/^0+(?!$)/, '');
  
    // Se tiver menos de 3 dígitos, apenas adiciona a vírgula corretamente
    if (valorLimite.length <= 2) {
      this.centroCustoForm.controls['valorLimite'].setValue(`0,${valorLimite.padStart(2, '0')}`, { emitEvent: false });
      return;
    }
  
    // Separa os centavos (últimos 2 dígitos)
    let inteiro = valorLimite.slice(0, -2);
    let decimal = valorLimite.slice(-2);
  
    // Aplica separadores de milhar
    inteiro = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
    // Monta o valor final
    let valorFormatado = `${inteiro},${decimal}`;
    console.log(valorFormatado)
    // Atualiza o campo sem disparar eventos infinitos
    this.centroCustoForm.controls['valorLimite'].setValue(valorFormatado, { emitEvent: false });
  }
}
