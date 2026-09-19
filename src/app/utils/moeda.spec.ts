import { campoParaNumero, formatarValor, mascararMoeda, numeroParaCampo } from './moeda';

describe('moeda', () => {
  describe('mascararMoeda', () => {
    it('trata os dígitos como centavos', () => {
      expect(mascararMoeda('5')).toBe('0,05');
      expect(mascararMoeda('123')).toBe('1,23');
      expect(mascararMoeda('123456')).toBe('1.234,56');
      expect(mascararMoeda('12345678')).toBe('123.456,78');
    });

    it('ignora o que não é número e zeros à esquerda', () => {
      expect(mascararMoeda('R$ 1.234,56')).toBe('1.234,56');
      expect(mascararMoeda('000012')).toBe('0,12');
    });

    it('devolve vazio quando não há dígitos', () => {
      expect(mascararMoeda('')).toBe('');
      expect(mascararMoeda('abc')).toBe('');
    });
  });

  describe('numeroParaCampo', () => {
    it('formata o número da API com milhar e dois decimais', () => {
      expect(numeroParaCampo(1234.5)).toBe('1.234,50');
      expect(numeroParaCampo(50)).toBe('50,00');
      expect(numeroParaCampo(1000000)).toBe('1.000.000,00');
    });
  });

  describe('campoParaNumero', () => {
    it('converte o texto do campo no número enviado à API', () => {
      expect(campoParaNumero('1.234,56')).toBe(1234.56);
      expect(campoParaNumero('0,05')).toBe(0.05);
    });

    it('ida e volta mantém o valor', () => {
      expect(campoParaNumero(numeroParaCampo(98765.43))).toBe(98765.43);
    });
  });

  describe('formatarValor', () => {
    it('usa o padrão brasileiro', () => {
      expect(formatarValor(1234.5)).toBe('1.234,50');
      expect(formatarValor('42')).toBe('42,00');
    });

    it('mostra zero para valores ausentes ou inválidos', () => {
      expect(formatarValor(null)).toBe('0,00');
      expect(formatarValor(undefined)).toBe('0,00');
      expect(formatarValor('abc')).toBe('0,00');
    });
  });
});
