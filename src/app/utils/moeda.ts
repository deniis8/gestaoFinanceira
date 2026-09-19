/** Aplica a máscara 1.234,56 sobre o que foi digitado (os dígitos viram centavos). */
export function mascararMoeda(digitado: string): string {
  let digitos = (digitado ?? '').replace(/\D/g, '');

  if (digitos.length === 0) {
    return '';
  }

  digitos = digitos.replace(/^0+(?!$)/, '');

  if (digitos.length <= 2) {
    return `0,${digitos.padStart(2, '0')}`;
  }

  const inteiro = digitos.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${inteiro},${digitos.slice(-2)}`;
}

/** Converte o número vindo da API (1234.5) para o texto do campo (1.234,50). */
export function numeroParaCampo(valor: number | string): string {
  const [inteiro, decimal] = valor.toString().replace('.', ',').split(',');
  return `${inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decimal ? decimal.padEnd(2, '0') : '00'}`;
}

/** Converte o texto do campo (1.234,50) no número que a API espera. */
export function campoParaNumero(texto: string): number {
  return Number(String(texto).replace(/\./g, '').replace(',', '.'));
}

/** Formato de exibição, sem o símbolo: 1.234,50 */
export function formatarValor(valor: number | string | null | undefined): string {
  const numero = Number(valor);
  if (valor == null || isNaN(numero)) {
    return '0,00';
  }
  return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
