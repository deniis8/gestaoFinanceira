import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ConfiguracoesIaService } from 'src/app/services/configuracoes-ia/configuracoes-ia.service';
import { MensagensService } from 'src/app/services/mensagens/mensagens.service';
import { chaveDoDia } from 'src/app/utils/datas';
import { ConfiguracoesIA } from 'src/types';

type Campo = 'filtroDataDe' | 'filtroDataAte' | 'prompt';

@Component({
  selector: 'app-configuracoes-ia',
  imports: [ReactiveFormsModule],
  templateUrl: './configuracoes-ia.component.html',
  styleUrl: './configuracoes-ia.component.css'
})
export class ConfiguracoesIaComponent implements OnInit {
  private configuracoesIAService = inject(ConfiguracoesIaService);
  private mensagens = inject(MensagensService);

  configuracoesIAForm = new FormGroup({
    id: new FormControl<number | null>(null),
    filtroDataDe: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    filtroDataAte: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    prompt: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    idUsuario: new FormControl<number | null>(null),
  });

  carregando = signal(true);
  salvando = signal(false);
  tentouEnviar = signal(false);

  ngOnInit(): void {
    this.configuracoesIAService.getConfiguracaoIA().subscribe({
      next: item => {
        if (item) {
          this.configuracoesIAForm.patchValue({
            ...item,
            filtroDataDe: chaveDoDia(item.filtroDataDe),
            filtroDataAte: chaveDoDia(item.filtroDataAte)
          });
        }
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false)
    });
  }

  /** Só existe uma configuração por usuário e ela é atualizada pelo id. */
  get semConfiguracao(): boolean {
    return !this.carregando() && this.configuracoesIAForm.controls.id.value == null;
  }

  mostrarErro(nome: Campo): boolean {
    const controle = this.configuracoesIAForm.controls[nome];
    return controle.invalid && (controle.touched || this.tentouEnviar());
  }

  submit(): void {
    this.tentouEnviar.set(true);
    if (this.configuracoesIAForm.invalid) {
      this.configuracoesIAForm.markAllAsTouched();
      return;
    }

    const id = this.configuracoesIAForm.controls.id.value;
    if (id == null) {
      return;
    }

    this.salvando.set(true);
    const payload = this.configuracoesIAForm.getRawValue() as unknown as ConfiguracoesIA;

    this.configuracoesIAService.putConfiguracaoIA(payload, id).subscribe({
      next: () => {
        this.salvando.set(false);
        this.mensagens.sucesso('Configurações da IA salvas.');
      },
      error: () => this.salvando.set(false)
    });
  }
}
