import { construirGeometriaLinha } from './grafico-linha';

describe('construirGeometriaLinha', () => {
  it('devolve geometria vazia para uma lista vazia', () => {
    expect(construirGeometriaLinha([], 400, 120)).toEqual({ pontos: [], caminhoLinha: '', caminhoArea: '' });
  });

  it('centraliza verticalmente um único valor', () => {
    const { pontos, caminhoLinha } = construirGeometriaLinha([1000], 400, 120, 8);

    expect(pontos.length).toBe(1);
    expect(pontos[0].y).toBe(60); // (8 + (120-8)) / 2
    expect(caminhoLinha.startsWith('M')).toBeTrue();
    expect(caminhoLinha).not.toContain('L'); // um único ponto não tem segmento de linha
  });

  it('desenha uma linha reta (sem variação vertical) quando todos os valores são iguais', () => {
    const { pontos } = construirGeometriaLinha([500, 500, 500], 400, 120, 8);

    expect(new Set(pontos.map(p => p.y)).size).toBe(1);
  });

  it('coloca o maior valor no topo (y menor) e o menor valor na base (y maior)', () => {
    const { pontos } = construirGeometriaLinha([100, 500, 300], 400, 120, 8);

    const [pontoMenor, pontoMaior, pontoMeio] = pontos;
    expect(pontoMaior.y).toBeLessThan(pontoMeio.y);
    expect(pontoMeio.y).toBeLessThan(pontoMenor.y);
  });

  it('distribui os pontos uniformemente no eixo X, do preenchimento esquerdo ao direito', () => {
    const { pontos } = construirGeometriaLinha([1, 2, 3, 4], 400, 120, 8);

    expect(pontos[0].x).toBe(8);
    expect(pontos[pontos.length - 1].x).toBe(392);
  });

  it('a área fecha até a base, passando pelos dois pontos extremos', () => {
    const { caminhoArea, pontos } = construirGeometriaLinha([10, 20], 400, 120, 8);
    const base = (120 - 8).toFixed(1);

    expect(caminhoArea.endsWith('Z')).toBeTrue();
    expect(caminhoArea).toContain(`${pontos[pontos.length - 1].x.toFixed(1)} ${base}`);
    expect(caminhoArea).toContain(`${pontos[0].x.toFixed(1)} ${base}`);
  });
});
