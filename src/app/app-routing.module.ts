import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GraficosComponent } from './pages/graficos/graficos.component';
import { NovoLancamentoComponent } from './pages/lancamentos/novo-lancamento/novo-lancamento.component';
import { EditLancamentoComponent } from './pages/lancamentos/edit-lancamento/edit-lancamento.component';
import { ExcluirLancamentoComponent } from './pages/lancamentos/excluir-lancamento/excluir-lancamento.component';
import { ClimaAmbienteComponent } from './pages/clima-ambiente/clima-ambiente.component';
import { LoginComponent } from './pages/login/login.component';
import { EditCentroCustoComponent } from './pages/centro-custo/edit-centro-custo/edit-centro-custo.component';
import { ExcluirCentroCustoComponent } from './pages/centro-custo/excluir-centro-custo/excluir-centro-custo.component';
import { NovoCentroCustoComponent } from './pages/centro-custo/novo-centro-custo/novo-centro-custo.component';
import { TabelaCentroCustoComponent } from './pages/centro-custo/tabela-centro-custo/tabela-centro-custo.component';
import { TabelaLancamentoFixoComponent } from './pages/lancamento-fixo/tabela-lancamento-fixo/tabela-lancamento-fixo.component';
import { EditLancamentoFixoComponent } from './pages/lancamento-fixo/edit-lancamento-fixo/edit-lancamento-fixo.component';
import { ExcluirLancamentoFixoComponent } from './pages/lancamento-fixo/excluir-lancamento-fixo/excluir-lancamento-fixo.component';
import { NovoLancamentoFixoComponent } from './pages/lancamento-fixo/novo-lancamento-fixo/novo-lancamento-fixo.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'graficos', component: GraficosComponent},
  {path: 'lancamento/edit/:id', component: EditLancamentoComponent},
  {path: 'lancamento/excluir/:id', component: ExcluirLancamentoComponent},
  {path: 'lancamento/novo', component: NovoLancamentoComponent},
  {path: 'lancamento-fixo', component: TabelaLancamentoFixoComponent},
  {path: 'lancamento-fixo/edit/:id', component: EditLancamentoFixoComponent},
  {path: 'lancamento-fixo/excluir/:id', component: ExcluirLancamentoFixoComponent},
  {path: 'lancamento-fixo/novo', component: NovoLancamentoFixoComponent},
  {path: 'clima-ambiente', component: ClimaAmbienteComponent},
  {path: 'centro-custo', component: TabelaCentroCustoComponent},
  {path: 'centro-custo/edit/:id', component: EditCentroCustoComponent},
  {path: 'centro-custo/excluir/:id', component: ExcluirCentroCustoComponent},
  {path: 'centro-custo/novo', component: NovoCentroCustoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
