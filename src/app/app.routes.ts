import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

/** `foco: true` esconde a barra de abas no celular nas telas de formulário. */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'login',
    title: 'Entrar',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        title: 'Lançamentos',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'graficos',
        title: 'Gráficos',
        loadComponent: () => import('./pages/graficos/graficos.component').then(m => m.GraficosComponent),
      },
      {
        path: 'lancamento/novo',
        title: 'Novo lançamento',
        data: { foco: true },
        loadComponent: () => import('./pages/lancamentos/lancamento-page/lancamento-page.component').then(m => m.LancamentoPageComponent),
      },
      {
        path: 'lancamento/edit/:id',
        title: 'Editar lançamento',
        data: { foco: true },
        loadComponent: () => import('./pages/lancamentos/lancamento-page/lancamento-page.component').then(m => m.LancamentoPageComponent),
      },
      {
        path: 'lancamento-fixo',
        title: 'Lançamentos fixos',
        loadComponent: () => import('./pages/lancamento-fixo/tabela-lancamento-fixo/tabela-lancamento-fixo.component').then(m => m.TabelaLancamentoFixoComponent),
      },
      {
        path: 'lancamento-fixo/novo',
        title: 'Novo lançamento fixo',
        data: { foco: true },
        loadComponent: () => import('./pages/lancamento-fixo/lancamento-fixo-page/lancamento-fixo-page.component').then(m => m.LancamentoFixoPageComponent),
      },
      {
        path: 'lancamento-fixo/edit/:id',
        title: 'Editar lançamento fixo',
        data: { foco: true },
        loadComponent: () => import('./pages/lancamento-fixo/lancamento-fixo-page/lancamento-fixo-page.component').then(m => m.LancamentoFixoPageComponent),
      },
      {
        path: 'centro-custo',
        title: 'Centros de custo',
        loadComponent: () => import('./pages/centro-custo/tabela-centro-custo/tabela-centro-custo.component').then(m => m.TabelaCentroCustoComponent),
      },
      {
        path: 'centro-custo/novo',
        title: 'Novo centro de custo',
        data: { foco: true },
        loadComponent: () => import('./pages/centro-custo/centro-custo-page/centro-custo-page.component').then(m => m.CentroCustoPageComponent),
      },
      {
        path: 'centro-custo/edit/:id',
        title: 'Editar centro de custo',
        data: { foco: true },
        loadComponent: () => import('./pages/centro-custo/centro-custo-page/centro-custo-page.component').then(m => m.CentroCustoPageComponent),
      },
      {
        path: 'configuracoes-ia',
        title: 'Configurações da IA',
        loadComponent: () => import('./pages/configuracoes-ia/configuracoes-ia.component').then(m => m.ConfiguracoesIaComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
