import { Lancamento } from 'src/types';
import { montarTextoCopia } from './copiar-lancamentos';

const lancamento = (dataHora: string, valor: number, descricao: string): Lancamento => ({
  dataHora, valor, descricao, status: 'Pago', idCCusto: 1, idUsuario: 1
});

describe('montarTextoCopia', () => {
  it('agrupa por dia, do mais antigo ao mais novo, e soma o total', () => {
    const texto = montarTextoCopia([
      lancamento('2026-09-18T10:00:00', 96, 'Cinema'),
      lancamento('2026-09-16T09:00:00', 1234.5, 'Mercado'),
      lancamento('2026-09-18T08:00:00', 18.5, 'Padaria'),
    ]);

    expect(texto).toBe(
      [
        '16/09/2026',
        'R$ 1.234,50 - Mercado',
        '',
        '18/09/2026',
        'R$ 96,00 - Cinema',
        'R$ 18,50 - Padaria',
        '',
        'Valor Total: R$ 1.349,00',
      ].join('\n')
    );
  });

  it('funciona com um único lançamento', () => {
    expect(montarTextoCopia([lancamento('2026-01-05T12:00:00', 10, 'Teste')]))
      .toBe('05/01/2026\nR$ 10,00 - Teste\n\nValor Total: R$ 10,00');
  });
});
