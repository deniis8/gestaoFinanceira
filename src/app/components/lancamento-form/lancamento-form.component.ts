import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { STATUS } from 'src/app/core/constantes';
import { CentroCustoService } from 'src/app/services/cetro-custo/centro-custo.service';
import { MoedaDirective } from 'src/app/shared/moeda/moeda.directive';
import { agoraParaInput } from 'src/app/utils/datas';
import { campoParaNumero, numeroParaCampo } from 'src/app/utils/moeda';
import { CentroCusto, Lancamento, LancamentoPayload } from 'src/types';

type Campo = 'dataHora' | 'valor' | 'descricao' | 'status' | 'idCCusto';

@Component({
  selector: 'app-lancamento-form',
  imports: [ReactiveFormsModule, MoedaDirective],
  templateUrl: './lancamento-form.component.html'
})
export class LancamentoFormComponent implements OnInit {
  private centroCustoService = inject(CentroCustoService);

  lancamentoData = input<Lancamento | null>(null);
  btnText = input.required<string>();
  enviando = input(false);
  cancelar = output<void>();
  salvar = output<LancamentoPayload>();

  readonly opcoesStatus = [
    { valor: STATUS.aPagar, rotulo: 'A pagar', tipo: 'saida' },
    { valor: STATUS.pago, rotulo: 'Pago', tipo: 'saida' },
    { valor: STATUS.aReceber, rotulo: 'A receber', tipo: 'entrada' },
    { valor: STATUS.recebido, rotulo: 'Recebido', tipo: 'entrada' },
  ];

  centroCustos = signal<CentroCusto[]>([]);
  tentouEnviar = signal(false);

  lancamentoForm = new FormGroup({
    dataHora: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    valor: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    descricao: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    idCCusto: new FormControl<number | null>(null, [Validators.required]),
  });

  ngOnInit(): void {
    const dados = this.lancamentoData();

    this.lancamentoForm.reset({
      dataHora: dados ? String(dados.dataHora).slice(0, 16) : agoraParaInput(),
      valor: dados ? numeroParaCampo(dados.valor) : '',
      descricao: dados?.descricao ?? '',
      status: dados?.status ?? '',
      idCCusto: dados?.idCCusto ?? null,
    });

    this.centroCustoService.getAllCentroCustos().subscribe({
      next: lista => this.centroCustos.set(lista ?? []),
      error: () => undefined
    });
  }

  mostrarErro(nome: Campo): boolean {
    const controle = this.lancamentoForm.controls[nome];
    return controle.invalid && (controle.touched || this.tentouEnviar());
  }

  submit(): void {
    this.tentouEnviar.set(true);
    if (this.lancamentoForm.invalid) {
      this.lancamentoForm.markAllAsTouched();
      return;
    }

    const valores = this.lancamentoForm.getRawValue();
    this.salvar.emit({
      dataHora: valores.dataHora,
      valor: campoParaNumero(valores.valor),
      descricao: valores.descricao,
      status: valores.status,
      idCCusto: Number(valores.idCCusto)
    });
  }
}
