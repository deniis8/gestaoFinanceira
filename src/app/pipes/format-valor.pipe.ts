import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatValor',
  standalone: false
})
export class FormatValorPipe implements PipeTransform {
  
  transform(valor: any): string {
    if (valor == null || isNaN(valor)) {
      return '0,00';
    }

    let numero = parseFloat(valor); // Converte para número corretamente

    return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
