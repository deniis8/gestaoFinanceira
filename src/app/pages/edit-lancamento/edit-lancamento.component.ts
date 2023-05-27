import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lancamento } from 'src/app/Lancamento';
import { LancamentoService } from 'src/app/services/lancamento.service';

@Component({
  selector: 'app-edit-lancamento',
  templateUrl: './edit-lancamento.component.html',
  styleUrls: ['./edit-lancamento.component.css']
})
export class EditLancamentoComponent implements OnInit{

  lancamento!: Lancamento;
  btnText: string = 'Editar';
  
  constructor(private lancamentoService: LancamentoService, private route: ActivatedRoute) {
        
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));

    this.lancamentoService.getLancamentoPorId(id).subscribe((item) => {
      this.lancamento = item;
      console.log(this.lancamento)
    })
  }
}
