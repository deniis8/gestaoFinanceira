import { getColorForSobra } from './colors';

describe('getColorForSobra', () => {
  it('é verde a partir de 2.000', () => {
    expect(getColorForSobra(2000)).toBe(getColorForSobra(15000));
  });

  it('é vermelho abaixo de zero', () => {
    expect(getColorForSobra(-0.01)).toBe(getColorForSobra(-5000));
    expect(getColorForSobra(-1)).not.toBe(getColorForSobra(2000));
  });

  it('passa gradualmente do verde ao amarelo entre 2.000 e 0', () => {
    const verde = getColorForSobra(2000);
    const meio = getColorForSobra(1000);
    const amarelo = getColorForSobra(0);

    expect(meio).not.toBe(verde);
    expect(meio).not.toBe(amarelo);
    expect(verde).not.toBe(amarelo);
  });
});
