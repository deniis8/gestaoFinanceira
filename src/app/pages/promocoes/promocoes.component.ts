import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, ElementRef, Injector, afterNextRender, computed, effect, inject, input, signal, untracked
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { Subject, catchError, map, of, switchMap } from 'rxjs';

import { FormatValorPipe } from 'src/app/pipes/format-valor.pipe';
import { LoginService } from 'src/app/services/login/login.service';
import { MensagensService } from 'src/app/services/mensagens/mensagens.service';
import { PromocoesService } from 'src/app/services/promocoes/promocoes.service';
import { GuilhocheComponent } from 'src/app/shared/guilhoche/guilhoche.component';
import { IconComponent, NomeIcone } from 'src/app/shared/icon/icon.component';
import { copiarParaAreaDeTransferencia } from 'src/app/utils/copiar-lancamentos';
import { formatarValor } from 'src/app/utils/moeda';
import { CupomPromocao, Promocao, TipoPromocao } from 'src/types';

interface OpcaoTipo {
  tipo: TipoPromocao;
  rotulo: string;
  icone: NomeIcone;
}

export const TIPOS_PROMOCAO: OpcaoTipo[] = [
  { tipo: 'tecnologia', rotulo: 'Tecnologia', icone: 'celular' },
  { tipo: 'moveis', rotulo: 'Móveis', icone: 'sofa' },
  { tipo: 'tenis-e-roupas', rotulo: 'Tênis e roupas', icone: 'camiseta' },
  { tipo: 'viagens', rotulo: 'Viagens', icone: 'aviao' },
  { tipo: 'outros', rotulo: 'Outros', icone: 'caixa' },
];

type Ordem = 'recentes' | 'menor-preco' | 'maior-desconto';

interface CartaoPromocao extends Promocao {
  /** Percentual de desconto sobre o preço antigo, arredondado. */
  descontoPct: number | null;
  cuponsOferta: CupomPromocao[];
  cuponsLoja: CupomPromocao[];
}

interface Carga {
  tipo: TipoPromocao;
  itens: Promocao[];
  em: Date | null;
  falhou: boolean;
}

/** A API guarda o resultado por 30 minutos; aqui só evita recarregar ao alternar entre as abas. */
const VALIDADE_CACHE_MS = 10 * 60 * 1000;

const semAcento = (texto: string): string =>
  texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

@Component({
  selector: 'app-promocoes',
  imports: [DatePipe, RouterLink, IconComponent, GuilhocheComponent, FormatValorPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './promocoes.component.html',
  styleUrl: './promocoes.component.css'
})
export class PromocoesComponent {
  private promocoesService = inject(PromocoesService);
  private mensagens = inject(MensagensService);
  private router = inject(Router);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private injector = inject(Injector);

  /** Parâmetro :tipo da rota. */
  tipo = input<string>();

  readonly tipos = TIPOS_PROMOCAO;
  readonly logado = inject(LoginService).estaLogado();

  tipoAtual = computed(() => this.tipos.find(opcao => opcao.tipo === this.tipo()) ?? null);

  estado = signal<'carregando' | 'pronto' | 'erro'>('carregando');
  promocoes = signal<Promocao[]>([]);
  atualizadoEm = signal<Date | null>(null);

  busca = signal('');
  soChinesas = signal(false);
  soComCupom = signal(false);
  ordem = signal<Ordem>('recentes');

  /** Chave "link|codigo" do cupom copiado há pouco, para trocar o ícone por um "ok". */
  copiado = signal<string | null>(null);
  imagensComErro = signal<ReadonlySet<string>>(new Set());

  resumo = computed(() => {
    const itens = this.promocoes();
    return {
      total: itens.length,
      comCupom: itens.filter(p => p.cupons.length > 0).length,
      chinesas: itens.filter(p => p.lojaChinesa).length,
    };
  });

  cartoes = computed<CartaoPromocao[]>(() => {
    const termo = semAcento(this.busca().trim());

    const filtrados = this.promocoes()
      .filter(p => !this.soChinesas() || p.lojaChinesa)
      .filter(p => !this.soComCupom() || p.cupons.length > 0)
      .filter(p => !termo || semAcento(`${p.produto} ${p.loja}`).includes(termo))
      .map(p => ({
        ...p,
        descontoPct: p.preco && p.precoAntigo ? Math.round((1 - p.preco / p.precoAntigo) * 100) : null,
        cuponsOferta: p.cupons.filter(c => c.origem === 'oferta'),
        cuponsLoja: p.cupons.filter(c => c.origem === 'loja'),
      }));

    // "Recentes" mantém a ordem da API; nas outras, quem não tem o dado vai para o fim.
    switch (this.ordem()) {
      case 'menor-preco':
        return filtrados.sort((a, b) => (a.preco ?? Infinity) - (b.preco ?? Infinity));
      case 'maior-desconto':
        return filtrados.sort((a, b) => (b.descontoPct ?? -1) - (a.descontoPct ?? -1));
      default:
        return filtrados;
    }
  });

  filtrando = computed(() => !!this.busca().trim() || this.soChinesas() || this.soComCupom());

  private cache = new Map<TipoPromocao, Carga>();
  private carga$ = new Subject<{ tipo: TipoPromocao; forcar: boolean }>();

  constructor() {
    this.carga$.pipe(
      switchMap(({ tipo, forcar }) => {
        const emCache = this.cache.get(tipo);
        if (!forcar && emCache && Date.now() - emCache.em!.getTime() < VALIDADE_CACHE_MS) {
          return of(emCache);
        }

        this.estado.set('carregando');
        return this.promocoesService.getPromocoes(tipo).pipe(
          map((itens): Carga => ({ tipo, itens, em: new Date(), falhou: false })),
          catchError(() => of<Carga>({ tipo, itens: [], em: null, falhou: true }))
        );
      }),
      takeUntilDestroyed()
    ).subscribe(carga => {
      if (carga.falhou) {
        this.estado.set('erro');
        return;
      }
      this.cache.set(carga.tipo, carga);
      this.promocoes.set(carga.itens);
      this.atualizadoEm.set(carga.em);
      this.estado.set('pronto');
    });

    effect(() => {
      const opcao = this.tipoAtual();
      untracked(() => {
        if (opcao) {
          this.carga$.next({ tipo: opcao.tipo, forcar: false });
          // No celular a faixa de tipos rola: um link direto para "viagens" deixaria a aba ativa fora da tela.
          afterNextRender(() => {
            this.host.nativeElement.querySelector('.tipo.ativo')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
          }, { injector: this.injector });
        } else {
          this.router.navigate(['/promocoes', this.tipos[0].tipo], { replaceUrl: true });
        }
      });
    });
  }

  recarregar(): void {
    const opcao = this.tipoAtual();
    if (opcao) {
      this.carga$.next({ tipo: opcao.tipo, forcar: true });
    }
  }

  limparFiltros(): void {
    this.busca.set('');
    this.soChinesas.set(false);
    this.soComCupom.set(false);
  }

  aoDigitar(evento: Event): void {
    this.busca.set((evento.target as HTMLInputElement).value);
  }

  aoOrdenar(evento: Event): void {
    this.ordem.set((evento.target as HTMLSelectElement).value as Ordem);
  }

  async copiar(promocao: Promocao, cupom: CupomPromocao): Promise<void> {
    const chave = `${promocao.link}|${cupom.codigo}`;
    try {
      await copiarParaAreaDeTransferencia(cupom.codigo);
      this.copiado.set(chave);
      setTimeout(() => this.copiado.update(atual => (atual === chave ? null : atual)), 2000);
    } catch {
      this.mensagens.erro(`Não foi possível copiar o cupom ${cupom.codigo}.`);
    }
  }

  foiCopiado(promocao: Promocao, cupom: CupomPromocao): boolean {
    return this.copiado() === `${promocao.link}|${cupom.codigo}`;
  }

  semImagem(promocao: Promocao): boolean {
    return !promocao.imagem || this.imagensComErro().has(promocao.imagem);
  }

  imagemFalhou(promocao: Promocao): void {
    if (promocao.imagem) {
      this.imagensComErro.update(atual => new Set(atual).add(promocao.imagem!));
    }
  }

  /** Texto curto do cupom: "R$ 35 OFF · acima de R$ 230,00". */
  detalheCupom(cupom: CupomPromocao): string {
    const partes: string[] = [];
    if (cupom.desconto) partes.push(cupom.desconto);
    if (cupom.compraMinima) partes.push(`acima de R$ ${formatarValor(cupom.compraMinima)}`);
    return partes.join(' · ');
  }
}
