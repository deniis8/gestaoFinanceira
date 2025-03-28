import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatValor',
  standalone: false
})
export class FormatValorPipe implements PipeTransform {

  transform(valor: any): string {
    if (typeof valor !== 'string') {
      valor = valor.toString();
    }

    valor = valor.replace(/\D/g, ''); // Remove tudo que não for número

    if (valor.length === 0) {
      return '0,00';
    }

    // Remove zeros à esquerda
    valor = valor.replace(/^0+(?!$)/, '');

    // Se tiver menos de 3 dígitos, apenas adiciona a vírgula corretamente
    if (valor.length <= 2) {
      return `0,${valor.padStart(2, '0')}`;
    }

    // Separa os centavos (últimos 2 dígitos)
    let inteiro = valor.slice(0, -2);
    let decimal = valor.slice(-2);

    // Aplica separadores de milhar
    inteiro = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Retorna o valor formatado
    return `${inteiro},${decimal}`;
  }

}
