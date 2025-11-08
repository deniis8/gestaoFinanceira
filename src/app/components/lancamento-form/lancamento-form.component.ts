import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CentroCustoService } from 'src/app/services/cetro-custo/centro-custo.service';
import { CentroCusto, Lancamento } from 'src/types';

@Component({
  selector: 'app-lancamento-form',
  templateUrl: './lancamento-form.component.html',
  styleUrls: ['./lancamento-form.component.css'],
  standalone: false
})
export class LancamentoFormComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<Lancamento>();
  @Input() btnText!: string;
  @Input() lancamentoData: Lancamento | null = null;
  lancamentoForm!: FormGroup;
  centroCustos: CentroCusto[] = [];

  constructor(private centroCustoService: CentroCustoService) { }

  ngOnInit(): void {
    this.lancamentoForm = new FormGroup({
      id: new FormControl(this.lancamentoData ? this.lancamentoData.id : ''),
      dataHora: new FormControl(this.lancamentoData ? this.lancamentoData.dataHora : this.getDataHoraAtual(), [Validators.required]),
      valor: new FormControl(this.lancamentoData ? this.formatValorInicial(this.lancamentoData.valor) : '', [Validators.required]),
      descricao: new FormControl(this.lancamentoData ? this.lancamentoData.descricao : '', [Validators.required]),
      status: new FormControl(this.lancamentoData ? this.lancamentoData.status : '', [Validators.required]),
      idCCusto: new FormControl(this.lancamentoData ? this.lancamentoData.idCCusto : '', [Validators.required]),
    });

    this.centroCustoService.getAllCentroCustos().subscribe((centroCustos) => (this.centroCustos = centroCustos));
  }

  // Formata o valor inicial quando carregado da API
  formatValorInicial(valor: number | string): string {
    let valorStr = valor.toString().replace('.', ','); // Troca ponto por vírgula
    let partes = valorStr.split(',');
    let inteiro = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona separador de milhar
    let decimal = partes[1] ? partes[1].padEnd(2, '0') : '00'; // Garante dois dígitos nos centavos
    return `${inteiro},${decimal}`;
  }

  formatValor(): void {
    let valor = this.valor.value.replace(/\D/g, ''); // Remove tudo que não for número
  
    if (valor.length === 0) {
      this.lancamentoForm.controls['valor'].setValue('', { emitEvent: false });
      return;
    }
  
    // Remove zeros à esquerda
    valor = valor.replace(/^0+(?!$)/, '');
  
    // Se tiver menos de 3 dígitos, apenas adiciona a vírgula corretamente
    if (valor.length <= 2) {
      this.lancamentoForm.controls['valor'].setValue(`0,${valor.padStart(2, '0')}`, { emitEvent: false });
      return;
    }
  
    // Separa os centavos (últimos 2 dígitos)
    let inteiro = valor.slice(0, -2);
    let decimal = valor.slice(-2);
  
    // Aplica separadores de milhar
    inteiro = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
    // Monta o valor final
    let valorFormatado = `${inteiro},${decimal}`;
  
    // Atualiza o campo sem disparar eventos infinitos
    this.lancamentoForm.controls['valor'].setValue(valorFormatado, { emitEvent: false });
  }

  getDataHoraAtual(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }

  get dataHora() {
    return this.lancamentoForm.get('dataHora')!;
  }

  get valor() {
    return this.lancamentoForm.get('valor')!;
  }

  get descricao() {
    return this.lancamentoForm.get('descricao')!;
  }

  get status() {
    return this.lancamentoForm.get('status')!;
  }

  get idCCusto() {
    return this.lancamentoForm.get('idCCusto')!;
  }

  get idUsuario() {
    return this.lancamentoForm.get('idUsuario')!;
  }

  submit(): void {
    if (this.lancamentoForm.invalid) {
      return;
    }
  
    let valorFormatado = String(this.valor.value)
      .replace(/\./g, '') // Remove pontos dos milhares
      .replace(',', '.'); // Troca vírgula por ponto para decimal
  
    let lancamentoFormatado = {
      ...this.lancamentoForm.value,
      valor: valorFormatado
    };
  
    this.onSubmit.emit(lancamentoFormatado);
  }
  
}
