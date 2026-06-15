import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MensagensService {

  constructor() { }

  mensagem(icon?: SweetAlertIcon, title?: string, text?: string, html?: string): void {
    Swal.fire({
      icon,
      title,
      text,
      html
    });
  }
}