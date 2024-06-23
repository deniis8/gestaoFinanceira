import { Component} from '@angular/core';
import { Lancamento } from 'src/app/Lancamento';
import { LancamentoService } from 'src/app/services/lancamento.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  lancamentos: Lancamento[] = [];
  dataDe: string = "";
  dataAte: string = "";

  constructor(private lancamentoService: LancamentoService) {
  }

  ngOnInit(): void {
    this.lancamentoService.getAllLancamentos().subscribe((lancamentos) => (this.lancamentos = lancamentos));
  }

  filtroData(): void {
    if(this.dataDe != "" && this.dataAte != ""){
      this.lancamentoService.getLancamentoDataDeAte(this.dataDe, this.dataAte).subscribe(item => {
        let infoLancamentos = item;
        this.lancamentos = [];
        if (infoLancamentos != null) {
          for (let i = 0; i < infoLancamentos.length; i++) {        
            this.lancamentos.push(infoLancamentos[i])
          }       
        }
      });
    }    
  }

  removerLancamento(id: Number): void {
    //console.log("Id: " + id)
    this.lancamentoService.excluirLancamento(id).subscribe();
  }
}
