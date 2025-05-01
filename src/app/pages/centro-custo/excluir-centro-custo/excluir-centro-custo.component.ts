import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CentroCusto } from 'src/app/models/Centro-Custo';
import { CentroCustoService } from 'src/app/services/cetro-custo/centro-custo.service';
import { LancamentoService } from 'src/app/services/lancamento/lancamento.service';
import { LoginService } from 'src/app/services/login/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-excluir-centro-custo',
  templateUrl: './excluir-centro-custo.component.html',
  styleUrl: './excluir-centro-custo.component.css',
  standalone: false
})
export class ExcluirCentroCustoComponent implements OnInit {

  centroCusto!: CentroCusto;
  btnText: string = 'Remover';
  quantidade: Number = 0;

  constructor(private centroCustoService: CentroCustoService, private lancamentoService: LancamentoService, private route: ActivatedRoute, private router: Router, private loginService: LoginService) {

  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));

    this.centroCustoService.getIdCentroCustos(id).subscribe((item) => {
      this.centroCusto = item;
    })
  }


  async excluirHendler(centroCustoData: CentroCusto) {
    const idCentroCusto = this.centroCusto.id!;
    const formData = new FormData();
    const idUsuario = this.loginService.getIdUsuario()?.toString();

    formData.append('descriCCusto', centroCustoData.descriCCusto ?? '');

    const item = await firstValueFrom(this.lancamentoService.getExisteCentroCusto(idUsuario ?? '', idCentroCusto));
    this.quantidade = item.quantidade;

    if(this.quantidade.valueOf() == 0){
      await this.centroCustoService.excluirCentroCusto(idCentroCusto).subscribe((result: any) => {
        this.router.navigate(['/centro-custo']);
      },
        (error) => {
          console.log("Erro");
        })
    }else{
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: `Esse centro de custo não pode ser excluído, pois ${this.quantidade === 1 ? 'existe ' : 'existem '} ${this.quantidade} ${this.quantidade === 1 ? 'lançamento ' : 'lançamentos '} ${this.quantidade === 1 ? 'atribuído' : 'atribuídos'} a ele.`,
    });
    }    
  }

}