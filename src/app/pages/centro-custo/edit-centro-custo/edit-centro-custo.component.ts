import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CentroCustoService } from 'src/app/services/cetro-custo/centro-custo.service';
import { LoginService } from 'src/app/services/login/login.service';
import { CentroCusto } from 'src/types';

@Component({
  selector: 'app-edit-centro-custo',
  templateUrl: './edit-centro-custo.component.html',
  styleUrl: './edit-centro-custo.component.css',
  standalone: false
})
export class EditCentroCustoComponent implements OnInit{

  centroCusto!: CentroCusto;
  btnText: string = 'Confirmar';
  
  constructor(private centroCustoService: CentroCustoService, private route: ActivatedRoute, private router: Router, private loginService: LoginService) {
        
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));

    this.centroCustoService.getIdCentroCustos(id).subscribe((item) => {
      this.centroCusto = item;
    })
  }

  async editHendler(centroCustoData: CentroCusto){    
    const id = this.centroCusto.id;
    const formData = new FormData();

    formData.append('descriCCusto', centroCustoData.descriCCusto ?? '');
    formData.append('valorLimite', centroCustoData.valorLimite.toString());

    await this.centroCustoService.putCentroCustos(id!, formData).subscribe((result: any) => {
      this.router.navigate(['/centro-custo']);
    },
      (error) => {
        console.log("Erro");
      })
  }
}