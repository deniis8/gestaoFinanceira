import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-pop-up-ia',
  templateUrl: './pop-up-ia.component.html',
  styleUrl: './pop-up-ia.component.css',
  standalone: false
})
export class PopUpIaComponent { 

  @Input() htmlIa?: SafeHtml;
  @Output() fechar = new EventEmitter<void>();

}
