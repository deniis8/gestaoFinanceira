import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Lancamento } from 'src/app/models/Lancamento';
import { LancamentoService } from 'src/app/services/lancamento.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-novo-lancamento',
  templateUrl: './novo-lancamento.component.html',
  styleUrls: ['./novo-lancamento.component.css']
})
export class NovoLancamentoComponent implements OnInit{
  btnText: string = "Registrar";

  constructor(private lancamentoService: LancamentoService, private router: Router, private loginService: LoginService){}

  ngOnInit(): void {
    
  }

  async createHandler(lancamento: Lancamento){
    const formData = new FormData();
    const idUsuario = this.loginService.getIdUsuario();

    formData.append('dataHora', lancamento.dataHora.toString());
    formData.append('valor', lancamento.valor.toString());
    formData.append('descricao', lancamento.descricao);
    formData.append('status', lancamento.status);
    formData.append('idCCusto', lancamento.idCCusto.toString());
    formData.append('idUsuario', idUsuario ?? '');

     //Todo
    console.log(lancamento.dataHora);
    console.log(formData.getAll("dataHora"));
    console.log(formData.getAll("valor"));
    console.log(formData.getAll("descricao"));
    console.log(formData.getAll("status"));
    console.log(formData.getAll("idCCusto"));
    console.log(formData.getAll("idUsuario"));
    await this.lancamentoService.postLancamento(formData).subscribe((result: any) => {
      this.router.navigate(['/home']);
    },
      (error) => {
        console.log("Erro");
      })

    

  //Exibir msg

  //Redirect
  }
 

}
