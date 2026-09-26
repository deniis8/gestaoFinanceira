import { Location } from '@angular/common';
import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';

import { LancamentoFormComponent } from 'src/app/components/lancamento-form/lancamento-form.component';
import { voltarOu } from 'src/app/core/navegacao';
import { LancamentoService } from 'src/app/services/lancamento/lancamento.service';
import { MensagensService } from 'src/app/services/mensagens/mensagens.service';
import { IconComponent } from 'src/app/shared/icon/icon.component';
import { Lancamento, LancamentoPayload } from 'src/types';

/** Serve as duas rotas: /lancamento/novo e /lancamento/edit/:id. */
@Component({
  selector: 'app-lancamento-page',
  imports: [LancamentoFormComponent, IconComponent],
  templateUrl: './lancamento-page.component.html'
})
export class LancamentoPageComponent implements OnInit {
  private lancamentoService = inject(LancamentoService);
  private mensagens = inject(MensagensService);
  private router = inject(Router);
  private location = inject(Location);

  /** Parâmetro da rota; ausente em /lancamento/novo. */
  id = input<string>();

  lancamento = signal<Lancamento | null>(null);
  falhou = signal(false);
  enviando = signal(false);
  edicao = computed(() => this.id() !== undefined);

  ngOnInit(): void {
    const id = this.id();
    if (id === undefined) {
      return;
    }

    this.lancamentoService.getLancamentoPorId(Number(id)).subscribe({
      next: item => this.lancamento.set(item),
      error: () => this.falhou.set(true)
    });
  }

  voltar(): void {
    voltarOu(this.location, this.router, '/home');
  }

  salvar(dados: LancamentoPayload): void {
    this.enviando.set(true);
    const id = this.lancamento()?.id;
    const requisicao = this.edicao() && id !== undefined
      ? this.lancamentoService.putLancamento(id, dados)
      : this.lancamentoService.postLancamento(dados);

    requisicao.subscribe({
      next: () => {
        this.mensagens.sucesso(this.edicao() ? 'Lançamento atualizado.' : 'Lançamento registrado.');
        this.router.navigate(['/home']);
      },
      error: () => this.enviando.set(false)
    });
  }
}
