import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { GraficosComponent } from './pages/graficos/graficos.component';
import { NovoLancamentoComponent } from './pages/novo-lancamento/novo-lancamento.component';
import { LancamentoFormComponent } from './components/lancamento-form/lancamento-form.component';
import { EditLancamentoComponent } from './pages/edit-lancamento/edit-lancamento.component';
import { ExcluirLancamentoComponent } from './pages/excluir-lancamento/excluir-lancamento.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    GraficosComponent,
    NovoLancamentoComponent,
    LancamentoFormComponent,
    EditLancamentoComponent,
    ExcluirLancamentoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
