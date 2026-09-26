import { Location } from '@angular/common';
import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';

import { LancamentoFixoFormComponent } from 'src/app/components/lancamento-fixo-form/lancamento-fixo-form.component';
import { voltarOu } from 'src/app/core/navegacao';
import { LancamentoFixoService } from 'src/app/services/lancamento-fixo/lancamento-fixo.service';
import { MensagensService } from 'src/app/services/mensagens/mensagens.service';
import { IconComponent } from 'src/app/shared/icon/icon.component';
import { LancamentoFixo, LancamentoFixoPayload } from 'src/types';

/** Serve as duas rotas: /lancamento-fixo/novo e /lancamento-fixo/edit/:id. */
@Component({
  selector: 'app-lancamento-fixo-page',
  imports: [LancamentoFixoFormComponent, IconComponent],
  templateUrl: './lancamento-fixo-page.component.html'
})
export class LancamentoFixoPageComponent implements OnInit {
  private lancamentoFixoService = inject(LancamentoFixoService);
  private mensagens = inject(MensagensService);
  private router = inject(Router);
  private location = inject(Location);

  id = input<string>();

  lancamentoFixo = signal<LancamentoFixo | null>(null);
  falhou = signal(false);
  enviando = signal(false);
  edicao = computed(() => this.id() !== undefined);

  ngOnInit(): void {
    const id = this.id();
    if (id === undefined) {
      return;
    }

    this.lancamentoFixoService.getLancamentoFixoPorId(Number(id)).subscribe({
      next: item => this.lancamentoFixo.set(item),
      error: () => this.falhou.set(true)
    });
  }

  voltar(): void {
    voltarOu(this.location, this.router, '/lancamento-fixo');
  }

  salvar(dados: LancamentoFixoPayload): void {
    this.enviando.set(true);
    const id = this.lancamentoFixo()?.id;
    const requisicao = this.edicao() && id !== undefined
      ? this.lancamentoFixoService.putLancamentoFixo(id, dados)
      : this.lancamentoFixoService.postLancamentoFixo(dados);

    requisicao.subscribe({
      next: () => {
        this.mensagens.sucesso(this.edicao() ? 'Lançamento fixo atualizado.' : 'Lançamento fixo criado.');
        this.router.navigate(['/lancamento-fixo']);
      },
      error: () => this.enviando.set(false)
    });
  }
}
