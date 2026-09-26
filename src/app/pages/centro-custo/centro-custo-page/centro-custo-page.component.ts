import { Location } from '@angular/common';
import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';

import { CentroCustoFormComponent } from 'src/app/components/centro-custo-form/centro-custo-form.component';
import { voltarOu } from 'src/app/core/navegacao';
import { CentroCustoService } from 'src/app/services/cetro-custo/centro-custo.service';
import { MensagensService } from 'src/app/services/mensagens/mensagens.service';
import { IconComponent } from 'src/app/shared/icon/icon.component';
import { CentroCusto, CentroCustoPayload } from 'src/types';

/** Serve as duas rotas: /centro-custo/novo e /centro-custo/edit/:id. */
@Component({
  selector: 'app-centro-custo-page',
  imports: [CentroCustoFormComponent, IconComponent],
  templateUrl: './centro-custo-page.component.html'
})
export class CentroCustoPageComponent implements OnInit {
  private centroCustoService = inject(CentroCustoService);
  private mensagens = inject(MensagensService);
  private router = inject(Router);
  private location = inject(Location);

  id = input<string>();

  centroCusto = signal<CentroCusto | null>(null);
  falhou = signal(false);
  enviando = signal(false);
  edicao = computed(() => this.id() !== undefined);

  ngOnInit(): void {
    const id = this.id();
    if (id === undefined) {
      return;
    }

    this.centroCustoService.getIdCentroCustos(Number(id)).subscribe({
      next: item => this.centroCusto.set(item),
      error: () => this.falhou.set(true)
    });
  }

  voltar(): void {
    voltarOu(this.location, this.router, '/centro-custo');
  }

  salvar(dados: CentroCustoPayload): void {
    this.enviando.set(true);
    const id = this.centroCusto()?.id;
    const requisicao = this.edicao() && id !== undefined
      ? this.centroCustoService.putCentroCustos(id, dados)
      : this.centroCustoService.postCentroCusto(dados);

    requisicao.subscribe({
      next: () => {
        this.mensagens.sucesso(this.edicao() ? 'Centro de custo atualizado.' : 'Centro de custo criado.');
        this.router.navigate(['/centro-custo']);
      },
      error: () => this.enviando.set(false)
    });
  }
}
