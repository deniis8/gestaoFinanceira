import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Roseta de guilhochê, o desenho de linhas finas que protege as cédulas.
 * Uma onda circular, repetida com pequenos giros, tece uma faixa de linhas cruzadas.
 */
interface Faixa {
  caminho: string;
  angulos: number[];
}

function onda(raio: number, amplitude: number, ondas: number): string {
  const passos = ondas * 24;
  const pontos: string[] = [];
  for (let i = 0; i <= passos; i++) {
    const t = (i / passos) * Math.PI * 2;
    const r = raio + amplitude * Math.sin(ondas * t);
    pontos.push(`${i === 0 ? 'M' : 'L'}${(r * Math.cos(t)).toFixed(1)} ${(r * Math.sin(t)).toFixed(1)}`);
  }
  return pontos.join('') + 'Z';
}

function faixa(raio: number, amplitude: number, ondas: number, copias: number): Faixa {
  const passo = 360 / ondas / copias;
  return {
    caminho: onda(raio, amplitude, ondas),
    angulos: Array.from({ length: copias }, (_, i) => +(passo * i).toFixed(3))
  };
}

@Component({
  selector: 'app-guilhoche',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="-100 -100 200 200" fill="none" stroke="currentColor" stroke-width="0.32"
         aria-hidden="true" focusable="false">
      @for (item of faixas; track $index; let f = $index) {
        <g>
          @for (angulo of item.angulos; track angulo; let i = $index) {
            <path [attr.d]="item.caminho" [attr.transform]="'rotate(' + angulo + ')'"
                  pathLength="1" [style.animation-delay.ms]="f * 500 + i * 45" />
          }
        </g>
      }
    </svg>
  `,
  styles: `
    :host { display: block; }
    svg { width: 100%; height: 100%; display: block; }
    path {
      stroke-dasharray: 1;
      animation: gravar 2s cubic-bezier(0.4, 0, 0.2, 1) both;
    }
    @keyframes gravar { from { stroke-dashoffset: 1; opacity: 0; } 15% { opacity: 1; } to { stroke-dashoffset: 0; } }
  `
})
export class GuilhocheComponent {
  protected readonly faixas: Faixa[] = [
    faixa(80, 13, 18, 26), // faixa externa
    faixa(50, 12, 12, 22), // faixa média
    faixa(24, 8, 8, 16),   // miolo
  ];
}
