import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { STATUS } from 'src/app/core/constantes';
import { CentroCustoService } from 'src/app/services/cetro-custo/centro-custo.service';
import { MoedaDirective } from 'src/app/shared/moeda/moeda.directive';
import { campoParaNumero, numeroParaCampo } from 'src/app/utils/moeda';
import { CentroCusto, LancamentoFixo, LancamentoFixoPayload } from 'src/types';

type Campo = 'diaMes' | 'valor' | 'descricao' | 'status' | 'idCCusto';

@Component({
  selector: 'app-lancamento-fixo-form',
  imports: [ReactiveFormsModule, MoedaDirective],
  templateUrl: './lancamento-fixo-form.component.html'
})
export class LancamentoFixoFormComponent implements OnInit {
  private centroCustoService = inject(CentroCustoService);

  lancamentoFixoData = input<LancamentoFixo | null>(null);
  btnText = input.required<string>();
  enviando = input(false);
  cancelar = output<void>();
  salvar = output<LancamentoFixoPayload>();

  /** Lançamento fixo só nasce como "a pagar" ou "a receber". */
  readonly opcoesStatus = [
    { valor: STATUS.aPagar, rotulo: 'A pagar', tipo: 'saida' },
    { valor: STATUS.aReceber, rotulo: 'A receber', tipo: 'entrada' },
  ];
  readonly dias = Array.from({ length: 31 }, (_, i) => i + 1);

  centroCustos = signal<CentroCusto[]>([]);
  tentouEnviar = signal(false);

  lancamentoFixoForm = new FormGroup({
    diaMes: new FormControl<number | null>(null, [Validators.required]),
    valor: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    descricao: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    idCCusto: new FormControl<number | null>(null, [Validators.required]),
  });

  ngOnInit(): void {
    const dados = this.lancamentoFixoData();

    this.lancamentoFixoForm.reset({
      diaMes: dados?.diaMes ?? null,
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
    const controle = this.lancamentoFixoForm.controls[nome];
    return controle.invalid && (controle.touched || this.tentouEnviar());
  }

  submit(): void {
    this.tentouEnviar.set(true);
    if (this.lancamentoFixoForm.invalid) {
      this.lancamentoFixoForm.markAllAsTouched();
      return;
    }

    const valores = this.lancamentoFixoForm.getRawValue();
    this.salvar.emit({
      diaMes: Number(valores.diaMes),
      valor: campoParaNumero(valores.valor),
      descricao: valores.descricao,
      status: valores.status,
      idCCusto: Number(valores.idCCusto)
    });
  }
}
