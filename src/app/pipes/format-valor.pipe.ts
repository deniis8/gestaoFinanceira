import { Pipe, PipeTransform } from '@angular/core';
import { formatarValor } from '../utils/moeda';

@Pipe({
  name: 'formatValor'
})
export class FormatValorPipe implements PipeTransform {
  transform(valor: number | string | null | undefined): string {
    return formatarValor(valor);
  }
}
