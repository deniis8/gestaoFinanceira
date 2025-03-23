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
import { EditLancamentoComponent } from './pages/lancamentos/edit-lancamento/edit-lancamento.component';
import { ExcluirLancamentoComponent } from './pages/lancamentos/excluir-lancamento/excluir-lancamento.component';
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
        LoginComponent
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
