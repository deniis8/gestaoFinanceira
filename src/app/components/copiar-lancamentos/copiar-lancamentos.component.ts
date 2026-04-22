import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Lancamento } from 'src/types';

@Component({
  selector: 'app-copiar-lancamentos',
  templateUrl: './copiar-lancamentos.component.html',
  styleUrl: './copiar-lancamentos.component.css',
  standalone: false
})

export class CopiarLancamentosComponent {

  @Input() lancamentos: Lancamento[] = [];
  @Output() fechar = new EventEmitter<void>();
  selectedLancamentos: number[] = [];

  toggleSelecao(id: number): void {
    const index = this.selectedLancamentos.indexOf(id);
    if (index > -1) {
      this.selectedLancamentos.splice(index, 1);
    } else {
      this.selectedLancamentos.push(id);
    }
  }

  isSelecionado(id: number): boolean {
    return this.selectedLancamentos.includes(id);
  }

  selecionarTodos(event: any): void {
    if (event.target.checked) {
      this.selectedLancamentos = this.lancamentos.map(l => l.id).filter((id): id is number => id !== undefined);
    } else {
      this.selectedLancamentos = [];
    }
  }

  copiarSelecionados(): void {
    if (this.selectedLancamentos.length === 0) {
      return;
    }

    // Filtrar apenas os lançamentos selecionados
    const lancamentosSelecionados = this.lancamentos.filter(l => this.selectedLancamentos.includes(l.id!));

    // Agrupar por data
    const lancamentosPorData = new Map<string, typeof lancamentosSelecionados>();
    lancamentosSelecionados.forEach(lancamento => {
      const data = new Date(lancamento.dataHora).toLocaleDateString('pt-BR');
      if (!lancamentosPorData.has(data)) {
        lancamentosPorData.set(data, []);
      }
      lancamentosPorData.get(data)!.push(lancamento);
    });

    // Calcular o total
    const total = lancamentosSelecionados.reduce((sum, lancamento) => sum + lancamento.valor, 0);

    // Formatar os dados para cópia
    let textoParaCopiar = '';

    // Ordenar datas e processar
    const datasOrdenadas = Array.from(lancamentosPorData.keys()).sort((a, b) => {
      const [diaA, mesA, anoA] = a.split('/').map(Number);
      const [diaB, mesB, anoB] = b.split('/').map(Number);
      return new Date(anoA, mesA - 1, diaA).getTime() - new Date(anoB, mesB - 1, diaB).getTime();
    });

    datasOrdenadas.forEach(data => {
      textoParaCopiar += `${data}\n`;
      const lancamentosData = lancamentosPorData.get(data)!;
      
      lancamentosData.forEach(lancamento => {
        const valor = lancamento.valor.toLocaleString('pt-BR', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        });
        textoParaCopiar += `R$ ${valor} - ${lancamento.descricao}\n`;
      });
      
      textoParaCopiar += '\n';
    });

    textoParaCopiar += `Valor Total: R$ ${total.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;

    // Copiar para área de transferência
    navigator.clipboard.writeText(textoParaCopiar).then(() => {
      this.fecharPopup();
    }).catch(err => {
      console.error('Erro ao copiar para área de transferência:', err);
    });
  }

  fecharPopup() {
    this.lancamentos = [];
    this.selectedLancamentos = [];
    this.fechar.emit();
  }

}
