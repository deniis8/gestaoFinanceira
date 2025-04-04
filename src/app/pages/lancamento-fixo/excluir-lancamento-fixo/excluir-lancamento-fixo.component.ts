import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LancamentoFixo } from 'src/app/models/Lancamento-Fixo';
import { LancamentoFixoService } from 'src/app/services/lancamento-fixo.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-excluir-lancamento-fixo',
  templateUrl: './excluir-lancamento-fixo.component.html',
  styleUrl: './excluir-lancamento-fixo.component.css',
  standalone: false
})
export class ExcluirLancamentoFixoComponent implements OnInit{

  lancamentoFixo!: LancamentoFixo;
  btnText: string = 'Remover';
  
  constructor(private lancamentoFixoService: LancamentoFixoService, private route: ActivatedRoute, private router: Router , private loginService: LoginService) {
        
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));

    this.lancamentoFixoService.getLancamentoFixoPorId(id).subscribe((item) => {
      this.lancamentoFixo = item;
      console.log(this.lancamentoFixo.diaMes)
    })
  }


  async excluirHendler(lancamentoFixoData: LancamentoFixo){    
    const id = this.lancamentoFixo.id;
    const formData = new FormData();
    const idUsuario = this.loginService.getIdUsuario();

    formData.append('diaMes', lancamentoFixoData.diaMes.toString());
    formData.append('valor', lancamentoFixoData.valor.toString());
    formData.append('descricao', lancamentoFixoData.descricao);
    formData.append('status', lancamentoFixoData.status);
    formData.append('idCCusto', lancamentoFixoData.idCCusto.toString());
    formData.append('idUsuario', idUsuario ?? '');

    await this.lancamentoFixoService.excluirLancamentoFixo(this.lancamentoFixo.id!).subscribe((result: any) => {
      this.router.navigate(['/lancamento-fixo']);
    },
      (error) => {
        console.log("Erro");
      })
  }

}
