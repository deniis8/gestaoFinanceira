function hexToRgb(hex: string) {
  const h = hex.replace('#','');
  const bigint = parseInt(h.length === 3 ? h.split('').map(c=>c+c).join('') : h, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (n: number) => {
    const h = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return h.length === 1 ? '0' + h : h;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function interpolateHex(hex1: string, hex2: string, t: number) {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  const r = lerp(c1.r, c2.r, t);
  const g = lerp(c1.g, c2.g, t);
  const b = lerp(c1.b, c2.b, t);
  return rgbToHex(r, g, b);
}

export function getColorForSobra(sobra: number): string {
  const GREEN = '#00A859';  // verde
  const YELLOW = '#FFD100'; // amarelo
  const RED = '#FF0000';    // vermelho

  if (sobra >= 2000) {
    return GREEN;
  }

  if (sobra < 0) {
    return RED;
  }

  const t = 1 - (sobra / 2000);  
  return interpolateHex(GREEN, YELLOW, t);
}
