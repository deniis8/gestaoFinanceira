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

    // Tentar copiar usando diferentes métodos
    this.copiarParaClipboard(textoParaCopiar).then(() => {
      this.fecharPopup();
    }).catch(err => {
      console.error('Erro ao copiar para área de transferência:', err);
      this.mostrarTextoParaCopiar(textoParaCopiar);
    });
  }

  private async copiarParaClipboard(texto: string): Promise<void> {
    // Método 1: Usar navigator.clipboard (moderno)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(texto);
      return;
    }

    // Método 2: Fallback com document.execCommand
    const textArea = document.createElement('textarea');
    textArea.value = texto;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (!successful) {
        throw new Error('Falha no execCommand');
      }
    } finally {
      document.body.removeChild(textArea);
    }
  }

  private mostrarTextoParaCopiar(texto: string): void {
    // Criar um modal ou alert com o texto para copiar manualmente
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: white;
      padding: 20px;
      border-radius: 8px;
      max-width: 500px;
      width: 90%;
      max-height: 70vh;
      overflow-y: auto;
    `;

    content.innerHTML = `
      <h3>Copie o texto abaixo:</h3>
      <textarea style="width: 100%; height: 200px; margin: 10px 0; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-family: monospace;" readonly>${texto}</textarea>
      <div style="text-align: right;">
        <button id="fechar-modal" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Fechar</button>
      </div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Focar automaticamente no textarea
    const textarea = content.querySelector('textarea') as HTMLTextAreaElement;
    textarea.focus();
    textarea.select();

    // Função para fechar o modal
    const fecharModal = () => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
      this.fecharPopup();
    };

    // Evento para fechar com botão
    const fecharBtn = content.querySelector('#fechar-modal') as HTMLButtonElement;
    fecharBtn.onclick = fecharModal;

    // Evento para fechar com ESC
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        fecharModal();
        document.removeEventListener('keydown', handleKeyDown);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
  }

  fecharPopup() {
    this.lancamentos = [];
    this.selectedLancamentos = [];
    this.fechar.emit();
  }

}
