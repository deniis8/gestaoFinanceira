import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LancamentoFixo } from 'src/app/models/Lancamento-Fixo';
import { LancamentoFixoService } from 'src/app/services/lancamento-fixo.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-novo-lancamento-fixo',
  templateUrl: './novo-lancamento-fixo.component.html',
  styleUrl: './novo-lancamento-fixo.component.css',
  standalone: false
})
export class NovoLancamentoFixoComponent implements OnInit{
  btnText: string = "Registrar";

  constructor(private lancamentoFixoService: LancamentoFixoService, private router: Router, private loginService: LoginService){}

  ngOnInit(): void {
    
  }

  async createHandler(lancamentoFixo: LancamentoFixo){
    const formData = new FormData();
    const idUsuario = this.loginService.getIdUsuario();

    formData.append('diaMes', lancamentoFixo.diaMes.toString());
    formData.append('valor', lancamentoFixo.valor.toString());
    formData.append('descricao', lancamentoFixo.descricao);
    formData.append('status', lancamentoFixo.status);
    formData.append('idCCusto', lancamentoFixo.idCCusto.toString());
    formData.append('idUsuario', idUsuario ?? '');

     //Todo
    console.log(lancamentoFixo.diaMes);
    console.log(formData.getAll("diaMes"));
    console.log(formData.getAll("valor"));
    console.log(formData.getAll("descricao"));
    console.log(formData.getAll("status"));
    console.log(formData.getAll("idCCusto"));
    console.log(formData.getAll("idUsuario"));
    await this.lancamentoFixoService.postLancamentoFixo(formData).subscribe((result: any) => {
      this.router.navigate(['/lancamento-fixo']);
    },
      (error) => {
        console.log("Erro");
      }) 

  //Exibir msg

  //Redirect
  }
 

}