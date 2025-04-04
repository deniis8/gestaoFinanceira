import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CentroCusto } from 'src/app/models/Centro-Custo';
import { LancamentoFixo } from 'src/app/models/Lancamento-Fixo';
import { CentroCustoService } from 'src/app/services/centro-custo.service';

@Component({
  selector: 'app-lancamento-fixo-form',
  templateUrl: './lancamento-fixo-form.component.html',
  styleUrl: './lancamento-fixo-form.component.css',
  standalone: false
})
export class LancamentoFixoFormComponent  implements OnInit {
  @Output() onSubmit = new EventEmitter<LancamentoFixo>();
  @Input() btnText!: string;
  @Input() lancamentoFixoData: LancamentoFixo | null = null;
  lancamentoFixoForm!: FormGroup;
  centroCustos: CentroCusto[] = [];
  dias: number[] = Array.from({ length: 31 }, (_, i) => i + 1);

  constructor(private centroCustoService: CentroCustoService) { }

  ngOnInit(): void {
    this.lancamentoFixoForm = new FormGroup({
      id: new FormControl(this.lancamentoFixoData ? this.lancamentoFixoData.id : ''),
      diaMes: new FormControl(this.lancamentoFixoData?.diaMes, [Validators.required]),
      valor: new FormControl(this.lancamentoFixoData ? this.formatValorInicial(this.lancamentoFixoData.valor) : '', [Validators.required]),
      descricao: new FormControl(this.lancamentoFixoData ? this.lancamentoFixoData.descricao : '', [Validators.required]),
      status: new FormControl(this.lancamentoFixoData ? this.lancamentoFixoData.status : '', [Validators.required]),
      idCCusto: new FormControl(this.lancamentoFixoData ? this.lancamentoFixoData.idCCusto : '', [Validators.required]),
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
      this.lancamentoFixoForm.controls['valor'].setValue('', { emitEvent: false });
      return;
    }
  
    // Remove zeros à esquerda
    valor = valor.replace(/^0+(?!$)/, '');
  
    // Se tiver menos de 3 dígitos, apenas adiciona a vírgula corretamente
    if (valor.length <= 2) {
      this.lancamentoFixoForm.controls['valor'].setValue(`0,${valor.padStart(2, '0')}`, { emitEvent: false });
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
    this.lancamentoFixoForm.controls['valor'].setValue(valorFormatado, { emitEvent: false });
  }

  get diaMes() {
    return this.lancamentoFixoForm.get('diaMes')!;
  }

  get valor() {
    return this.lancamentoFixoForm.get('valor')!;
  }

  get descricao() {
    return this.lancamentoFixoForm.get('descricao')!;
  }

  get status() {
    return this.lancamentoFixoForm.get('status')!;
  }

  get idCCusto() {
    return this.lancamentoFixoForm.get('idCCusto')!;
  }

  get idUsuario() {
    return this.lancamentoFixoForm.get('idUsuario')!;
  }

  submit(): void {
    if (this.lancamentoFixoForm.invalid) {
      return;
    }
  
    let valorFormatado = String(this.valor.value)
      .replace(/\./g, '') // Remove pontos dos milhares
      .replace(',', '.'); // Troca vírgula por ponto para decimal
  
    let lancamentoFormatado = {
      ...this.lancamentoFixoForm.value,
      valor: valorFormatado
    };
  
    this.onSubmit.emit(lancamentoFormatado);
  }
  
}