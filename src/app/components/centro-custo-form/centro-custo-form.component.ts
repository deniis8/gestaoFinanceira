import { Component, OnInit, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MoedaDirective } from 'src/app/shared/moeda/moeda.directive';
import { campoParaNumero, numeroParaCampo } from 'src/app/utils/moeda';
import { CentroCusto, CentroCustoPayload } from 'src/types';

type Campo = 'descriCCusto' | 'valorLimite';

@Component({
  selector: 'app-centro-custo-form',
  imports: [ReactiveFormsModule, MoedaDirective],
  templateUrl: './centro-custo-form.component.html'
})
export class CentroCustoFormComponent implements OnInit {
  centroCustoData = input<CentroCusto | null>(null);
  btnText = input.required<string>();
  enviando = input(false);
  cancelar = output<void>();
  salvar = output<CentroCustoPayload>();

  tentouEnviar = signal(false);

  centroCustoForm = new FormGroup({
    descriCCusto: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    valorLimite: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit(): void {
    const dados = this.centroCustoData();

    this.centroCustoForm.reset({
      descriCCusto: dados?.descriCCusto ?? '',
      valorLimite: dados ? numeroParaCampo(dados.valorLimite) : '',
    });
  }

  mostrarErro(nome: Campo): boolean {
    const controle = this.centroCustoForm.controls[nome];
    return controle.invalid && (controle.touched || this.tentouEnviar());
  }

  submit(): void {
    this.tentouEnviar.set(true);
    if (this.centroCustoForm.invalid) {
      this.centroCustoForm.markAllAsTouched();
      return;
    }

    const valores = this.centroCustoForm.getRawValue();
    this.salvar.emit({
      descriCCusto: valores.descriCCusto,
      valorLimite: campoParaNumero(valores.valorLimite)
    });
  }
}
