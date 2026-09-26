import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

import { LoginService } from './services/login/login.service';
import { FeedbackHostComponent } from './shared/feedback/feedback-host.component';
import { IconComponent, NomeIcone } from './shared/icon/icon.component';
import { SheetComponent } from './shared/sheet/sheet.component';

interface ItemDeMenu {
  rota: string;
  rotulo: string;
  icone: NomeIcone;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent, SheetComponent, FeedbackHostComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private router = inject(Router);
  private login = inject(LoginService);

  /** Menu lateral do desktop; no celular os quatro primeiros ficam na barra de abas. */
  readonly menu: ItemDeMenu[] = [
    { rota: '/home', rotulo: 'Lançamentos', icone: 'extrato' },
    { rota: '/graficos', rotulo: 'Gráficos', icone: 'grafico' },
    { rota: '/lancamento-fixo', rotulo: 'Lançamentos fixos', icone: 'repetir' },
    { rota: '/centro-custo', rotulo: 'Centros de custo', icone: 'etiqueta' },
    { rota: '/configuracoes-ia', rotulo: 'Configurações da IA', icone: 'brilho' },
  ];
  readonly menuMais = this.menu.slice(3);

  maisAberto = signal(false);

  private url = toSignal(
    this.router.events.pipe(
      filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd),
      map(evento => evento.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  naLogin = computed(() => this.url().startsWith('/login'));
  foco = computed(() => (this.url(), this.dadosDaRota()['foco'] === true));
  maisAtivo = computed(() => this.menuMais.some(item => this.url().startsWith(item.rota)));

  sair(): void {
    this.maisAberto.set(false);
    this.login.logout();
  }

  private dadosDaRota(): Record<string, unknown> {
    let rota = this.router.routerState.snapshot.root;
    while (rota.firstChild) {
      rota = rota.firstChild;
    }
    return rota.data;
  }
}
