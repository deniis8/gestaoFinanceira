import { chaveDoDia, paraDataISO, rotuloDoDia } from './datas';

describe('datas', () => {
  it('paraDataISO usa a data local, sem virar o dia por causa do fuso', () => {
    expect(paraDataISO(new Date(2026, 8, 5, 23, 59))).toBe('2026-09-05');
    expect(paraDataISO(new Date(2026, 0, 1, 0, 0))).toBe('2026-01-01');
  });

  it('chaveDoDia lê datas da API sem fuso como horário local', () => {
    expect(chaveDoDia('2026-09-18T22:30:00')).toBe('2026-09-18');
  });

  it('rotuloDoDia chama de Hoje e Ontem', () => {
    const hoje = new Date();
    const ontem = new Date();
    ontem.setDate(hoje.getDate() - 1);

    expect(rotuloDoDia(paraDataISO(hoje))).toBe('Hoje');
    expect(rotuloDoDia(paraDataISO(ontem))).toBe('Ontem');
  });

  it('rotuloDoDia inclui o ano quando não é o atual', () => {
    expect(rotuloDoDia('2019-03-04')).toContain('2019');
  });
});
