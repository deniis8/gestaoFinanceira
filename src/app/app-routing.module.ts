import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GraficosComponent } from './pages/graficos/graficos.component';
import { NovoLancamentoComponent } from './pages/novo-lancamento/novo-lancamento.component';
import { EditLancamentoComponent } from './pages/edit-lancamento/edit-lancamento.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'graficos', component: GraficosComponent},
  {path: 'lancamento/edit/:id', component: EditLancamentoComponent},
  {path: 'lancamento/novo', component: NovoLancamentoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
