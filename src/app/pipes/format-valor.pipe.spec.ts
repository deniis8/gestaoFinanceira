import { FormatValorPipe } from './format-valor.pipe';

describe('FormatValorPipe', () => {
  const pipe = new FormatValorPipe();

  it('formata em reais, com milhar e centavos', () => {
    expect(pipe.transform(1234.5)).toBe('1.234,50');
  });

  it('mostra 0,00 para vazio ou inválido', () => {
    expect(pipe.transform(null)).toBe('0,00');
    expect(pipe.transform('x')).toBe('0,00');
  });
});
