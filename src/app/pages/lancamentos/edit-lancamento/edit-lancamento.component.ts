import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lancamento } from 'src/app/models/Lancamento';
import { LancamentoService } from 'src/app/services/lancamento.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
    selector: 'app-edit-lancamento',
    templateUrl: './edit-lancamento.component.html',
    styleUrls: ['./edit-lancamento.component.css'],
    standalone: false
})
export class EditLancamentoComponent implements OnInit{

  lancamento!: Lancamento;
  btnText: string = 'Confirmar';
  
  constructor(private lancamentoService: LancamentoService, private route: ActivatedRoute, private router: Router, private loginService: LoginService) {
        
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));

    this.lancamentoService.getLancamentoPorId(id).subscribe((item) => {
      this.lancamento = item;
      console.log(this.lancamento.dataHora)
    })
  }

  async editHendler(lancamentoData: Lancamento){    
    const id = this.lancamento.id;
    const formData = new FormData();
    const idUsuario = this.loginService.getIdUsuario();

    formData.append('dataHora', lancamentoData.dataHora.toString());
    formData.append('valor', lancamentoData.valor.toString());
    formData.append('descricao', lancamentoData.descricao);
    formData.append('status', lancamentoData.status);
    formData.append('idCCusto', lancamentoData.idCCusto.toString());
    formData.append('idUsuario', idUsuario ?? '');

    await this.lancamentoService.putLancamento(id!, formData).subscribe((result: any) => {
      this.router.navigate(['/home']);
    },
      (error) => {
        console.log("Erro");
      })
  }
  
}
