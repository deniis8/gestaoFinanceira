import { Lancamento } from 'src/types';

const dinheiro = (valor: number): string =>
  valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * Texto de área de transferência: lançamentos agrupados por dia (do mais antigo ao mais novo),
 * uma linha "R$ valor - descrição" por lançamento e o total no fim.
 */
export function montarTextoCopia(lancamentos: Lancamento[]): string {
  const porData = new Map<string, Lancamento[]>();
  lancamentos.forEach(lancamento => {
    const data = new Date(lancamento.dataHora).toLocaleDateString('pt-BR');
    porData.set(data, [...(porData.get(data) ?? []), lancamento]);
  });

  const datas = Array.from(porData.keys()).sort((a, b) => {
    const [diaA, mesA, anoA] = a.split('/').map(Number);
    const [diaB, mesB, anoB] = b.split('/').map(Number);
    return new Date(anoA, mesA - 1, diaA).getTime() - new Date(anoB, mesB - 1, diaB).getTime();
  });

  let texto = '';
  datas.forEach(data => {
    texto += `${data}\n`;
    porData.get(data)!.forEach(lancamento => {
      texto += `R$ ${dinheiro(lancamento.valor)} - ${lancamento.descricao}\n`;
    });
    texto += '\n';
  });

  const total = lancamentos.reduce((soma, lancamento) => soma + lancamento.valor, 0);
  return `${texto}Valor Total: R$ ${dinheiro(total)}`;
}

/** Copia usando a API moderna e, sem ela, o método antigo do navegador. */
export async function copiarParaAreaDeTransferencia(texto: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(texto);
    return;
  }

  const area = document.createElement('textarea');
  area.value = texto;
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.focus();
  area.select();

  try {
    if (!document.execCommand('copy')) {
      throw new Error('Falha ao copiar');
    }
  } finally {
    document.body.removeChild(area);
  }
}
