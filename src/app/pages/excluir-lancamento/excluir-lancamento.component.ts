import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lancamento } from 'src/app/models/Lancamento';
import { LancamentoService } from 'src/app/services/lancamento.service';

@Component({
  selector: 'app-excluir-lancamento',
  templateUrl: './excluir-lancamento.component.html',
  styleUrls: ['./excluir-lancamento.component.css']
})
export class ExcluirLancamentoComponent implements OnInit{

  lancamento!: Lancamento;
  btnText: string = 'Remover';
  
  constructor(private lancamentoService: LancamentoService, private route: ActivatedRoute, private router: Router) {
        
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));

    this.lancamentoService.getLancamentoPorId(id).subscribe((item) => {
      this.lancamento = item;
      console.log(this.lancamento.dataHora)
    })
  }


  async excluirHendler(lancamentoData: Lancamento){    
    const id = this.lancamento.id;
    const formData = new FormData();

    formData.append('dataHora', lancamentoData.dataHora.toString());
    formData.append('valor', lancamentoData.valor.toString());
    formData.append('descricao', lancamentoData.descricao);
    formData.append('status', lancamentoData.status);
    formData.append('idCCusto', lancamentoData.idCCusto.toString());
    formData.append('idUsuario', '1'/*lancamento.idUsuario.toString()*/);

    await this.lancamentoService.excluirLancamento(this.lancamento.id!).subscribe((result: any) => {
      this.router.navigate(['/']);
    },
      (error) => {
        console.log("Erro");
      })
  }

}
