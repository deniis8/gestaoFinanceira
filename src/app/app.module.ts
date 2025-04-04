import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { GraficosComponent } from './pages/graficos/graficos.component';
import { NovoLancamentoComponent } from './pages/lancamentos/novo-lancamento/novo-lancamento.component';
import { LancamentoFormComponent } from './components/lancamento-form/lancamento-form.component';
import { CentroCustoFormComponent } from './components/centro-custo-form/centro-custo-form.component';
import { EditLancamentoComponent } from './pages/lancamentos/edit-lancamento/edit-lancamento.component';
import { EditCentroCustoComponent } from './pages/centro-custo/edit-centro-custo/edit-centro-custo.component';
import { ExcluirLancamentoComponent } from './pages/lancamentos/excluir-lancamento/excluir-lancamento.component';
import { ExcluirCentroCustoComponent } from './pages/centro-custo/excluir-centro-custo/excluir-centro-custo.component';
import { TabelaCentroCustoComponent } from './pages/centro-custo/tabela-centro-custo/tabela-centro-custo.component';
import { NovoCentroCustoComponent } from './pages/centro-custo/novo-centro-custo/novo-centro-custo.component';
import { LancamentoFixoFormComponent } from './components/lancamento-fixo-form/lancamento-fixo-form.component';
import { SaldosComponent } from './components/saldos/saldos.component';
import { ClimaAmbienteComponent } from './pages/clima-ambiente/clima-ambiente.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthInterceptor } from './services/interceptor.service';

// Importações para o Angular Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { FormatValorPipe } from './pipes/format-valor.pipe';
import { EditLancamentoFixoComponent } from './pages/lancamento-fixo/edit-lancamento-fixo/edit-lancamento-fixo.component';
import { ExcluirLancamentoFixoComponent } from './pages/lancamento-fixo/excluir-lancamento-fixo/excluir-lancamento-fixo.component';
import { NovoLancamentoFixoComponent } from './pages/lancamento-fixo/novo-lancamento-fixo/novo-lancamento-fixo.component';
import { TabelaLancamentoFixoComponent } from './pages/lancamento-fixo/tabela-lancamento-fixo/tabela-lancamento-fixo.component';

@NgModule({ declarations: [
        AppComponent,
        FooterComponent,
        HomeComponent,
        GraficosComponent,
        NovoLancamentoComponent,
        LancamentoFormComponent,
        EditLancamentoComponent,
        ExcluirLancamentoComponent,
        SaldosComponent,
        ClimaAmbienteComponent,
        LoginComponent,
        CentroCustoFormComponent,
        EditCentroCustoComponent,
        ExcluirCentroCustoComponent,
        NovoCentroCustoComponent,
        TabelaCentroCustoComponent,
        FormatValorPipe,
        LancamentoFixoFormComponent,
        EditLancamentoFixoComponent,
        ExcluirLancamentoFixoComponent,
        NovoLancamentoFixoComponent,
        TabelaLancamentoFixoComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule], providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
