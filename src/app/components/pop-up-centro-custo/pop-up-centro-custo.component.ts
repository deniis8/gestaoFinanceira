import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pop-up-centro-custo',
  templateUrl: './pop-up-centro-custo.component.html',
  styleUrl: './pop-up-centro-custo.component.css',
  standalone: false
})
export class PopUpCentroCustoComponent {

  @Input() aberto: boolean = false;

  //recebe exatamente o array preenchido no método do pai
  @Input() detalhamentoGastosCC: any[] = [];

  @Output() fechar = new EventEmitter<void>();

  fecharPopup() {
    this.fechar.emit();
  }

}
