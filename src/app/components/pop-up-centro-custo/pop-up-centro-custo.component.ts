import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pop-up-centro-custo',
  templateUrl: './pop-up-centro-custo.component.html',
  styleUrl: './pop-up-centro-custo.component.css',
  standalone: false
})
export class PopUpCentroCustoComponent {

  constructor(private router: Router) { }

  @Input() aberto: boolean = false;

  //recebe exatamente o array preenchido no método do pai
  @Input() detalhamentoGastosCC: any[] = [];

  @Output() fechar = new EventEmitter<void>();

  abrirEdicao(id: number) {
    document.body.classList.remove('no-scroll');
    this.router.navigate(['/lancamento/edit', id]);
  }

  abrirExclusao(id: number) {
    document.body.classList.remove('no-scroll');
    this.router.navigate(['/lancamento/excluir', id]);
  }

  fecharPopup() {
    this.fechar.emit();
    document.body.classList.remove('no-scroll');
  }

}
