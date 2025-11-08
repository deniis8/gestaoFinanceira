import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LancamentoFixoService } from 'src/app/services/lancamento-fixo/lancamento-fixo.service';
import { LoginService } from 'src/app/services/login/login.service';
import { LancamentoFixo } from 'src/types';

@Component({
  selector: 'app-edit-lancamento-fixo',
  templateUrl: './edit-lancamento-fixo.component.html',
  styleUrl: './edit-lancamento-fixo.component.css',
  standalone: false
})
export class EditLancamentoFixoComponent implements OnInit{

  lancamentoFixo!: LancamentoFixo;
  btnText: string = 'Confirmar';
  
  constructor(private lancamentoFixoService: LancamentoFixoService, private route: ActivatedRoute, private router: Router, private loginService: LoginService) {
        
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));

    this.lancamentoFixoService.getLancamentoFixoPorId(id).subscribe((item) => {
      this.lancamentoFixo = item;
      console.log(this.lancamentoFixo.diaMes)
    })
  }

  async editHendler(lancamentoFixoData: LancamentoFixo){    
    const id = this.lancamentoFixo.id;
    const formData = new FormData();
    const idUsuario = this.loginService.getIdUsuario();

    formData.append('diaMes', lancamentoFixoData.diaMes.toString());
    formData.append('valor', lancamentoFixoData.valor.toString());
    formData.append('descricao', lancamentoFixoData.descricao);
    formData.append('status', lancamentoFixoData.status);
    formData.append('idCCusto', lancamentoFixoData.idCCusto.toString());
    formData.append('idUsuario', idUsuario ?? '');

    await this.lancamentoFixoService.putLancamentoFixo(id!, formData).subscribe((result: any) => {
      this.router.navigate(['/lancamento-fixo']);
    },
      (error) => {
        console.log("Erro");
      })
  }
  
}