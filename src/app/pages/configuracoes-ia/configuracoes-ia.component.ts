import { Component } from '@angular/core';
import { ConfiguracoesIaService } from 'src/app/services/configuracoes-ia/configuracoes-ia.service';

@Component({
  selector: 'app-configuracoes-ia',
  templateUrl: './configuracoes-ia.component.html',
  styleUrl: './configuracoes-ia.component.css',
  standalone: false
})
export class ConfiguracoesIaComponent {

  constructor(private configuracoesIAService: ConfiguracoesIaService) { }

  ngOnInit(): void {
    this.buscarConfiguracaoIA();
  }

  public listaConfiguracoesIA: any[] = [];

  buscarConfiguracaoIA() {
    this.configuracoesIAService.getConfiguracaoIA().subscribe(item => {
      if (!item) {
        return;
      }
      this.listaConfiguracoesIA.push(item);
      console.log(this.listaConfiguracoesIA);
    });
  }

}
