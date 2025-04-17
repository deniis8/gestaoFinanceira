import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CentroCusto } from 'src/app/models/Centro-Custo';
import { CentroCustoService } from 'src/app/services/cetro-custo/centro-custo.service';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-novo-centro-custo',
  templateUrl: './novo-centro-custo.component.html',
  styleUrl: './novo-centro-custo.component.css',
  standalone: false
})
export class NovoCentroCustoComponent implements OnInit{
  btnText: string = "Registrar";

  constructor(private centroCustoService: CentroCustoService, private router: Router, private loginService: LoginService){}

  ngOnInit(): void {
    
  }

  async createHandler(centroCusto: CentroCusto){
    const formData = new FormData();
    const idUsuario = this.loginService.getIdUsuario();

    formData.append('descriCCusto', centroCusto.descriCCusto ?? '');
    formData.append('idUsuario', idUsuario ?? '');
    
    this.centroCustoService.postCentroCusto(formData).subscribe((result: any) => {
      this.router.navigate(['/centro-custo']);
    },
      (error) => {
        console.log("Erro");
      })
  }
}
