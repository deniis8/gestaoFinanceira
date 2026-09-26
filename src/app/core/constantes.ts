import { StatusLancamento } from 'src/types';

/** Valores exatamente como a API e o banco os usam. */
export const STATUS = {
  aPagar: 'A Pagar',
  pago: 'Pago',
  aReceber: 'A Receber',
  recebido: 'Recebido',
} as const satisfies Record<string, StatusLancamento>;

export const ROTULO_STATUS: Record<string, string> = {
  'A Pagar': 'A pagar',
  'Pago': 'Pago',
  'A Receber': 'A receber',
  'Recebido': 'Recebido',
};

/** Cor semântica de cada status (variável CSS). */
export const COR_STATUS: Record<string, string> = {
  'A Pagar': 'var(--pending)',
  'Pago': 'var(--expense)',
  'A Receber': 'var(--pending)',
  'Recebido': 'var(--income)',
};

/** Centros de custo de investimento: ficam fora dos gastos e das receitas do período. */
export const IDS_CENTROS_INVESTIMENTO: ReadonlySet<number> = new Set([19, 51]);

export const NOME_CENTRO_EMPRESTIMO = 'Empréstimo';

export const ehSaida = (status: string): boolean => status === STATUS.aPagar || status === STATUS.pago;
export const ehPendente = (status: string): boolean => status === STATUS.aPagar || status === STATUS.aReceber;

export const MESES_ABREV: Record<string, string> = {
  'Janeiro': 'Jan', 'Fevereiro': 'Fev', 'Março': 'Mar', 'Abril': 'Abr', 'Maio': 'Mai', 'Junho': 'Jun',
  'Julho': 'Jul', 'Agosto': 'Ago', 'Setembro': 'Set', 'Outubro': 'Out', 'Novembro': 'Nov', 'Dezembro': 'Dez',
};
