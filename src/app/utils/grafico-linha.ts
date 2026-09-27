/** Um ponto já convertido para as coordenadas do viewBox do SVG. */
export interface PontoLinha {
  x: number;
  y: number;
}

export interface GeometriaLinha {
  pontos: PontoLinha[];
  /** Só a linha, pronta para um <path stroke>. Vazio se não houver valores. */
  caminhoLinha: string;
  /** A linha fechada até a base, pronta para o preenchimento da área. */
  caminhoArea: string;
}

/**
 * Converte uma série de valores num gráfico de linha simples: eixo X distribuído
 * uniformemente, eixo Y escalado entre o menor e o maior valor. Sem curvas nem
 * suavização — segmentos retos são mais previsíveis para uma série curta.
 */
export function construirGeometriaLinha(valores: number[], largura: number, altura: number, preenchimento = 8): GeometriaLinha {
  if (valores.length === 0) {
    return { pontos: [], caminhoLinha: '', caminhoArea: '' };
  }

  const minimo = Math.min(...valores);
  const maximo = Math.max(...valores);
  const semVariacao = maximo === minimo;
  const amplitude = maximo - minimo;

  const xEsquerda = preenchimento;
  const xDireita = largura - preenchimento;
  const yTopo = preenchimento;
  const yBase = altura - preenchimento;
  const passoX = valores.length > 1 ? (xDireita - xEsquerda) / (valores.length - 1) : 0;

  const pontos = valores.map((valor, indice) => ({
    x: valores.length > 1 ? xEsquerda + passoX * indice : (xEsquerda + xDireita) / 2,
    y: semVariacao ? (yTopo + yBase) / 2 : yBase - ((valor - minimo) / amplitude) * (yBase - yTopo)
  }));

  const caminhoLinha = pontos.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('');

  const ultimo = pontos[pontos.length - 1];
  const primeiro = pontos[0];
  const caminhoArea = `${caminhoLinha}L${ultimo.x.toFixed(1)} ${yBase.toFixed(1)}L${primeiro.x.toFixed(1)} ${yBase.toFixed(1)}Z`;

  return { pontos, caminhoLinha, caminhoArea };
}
