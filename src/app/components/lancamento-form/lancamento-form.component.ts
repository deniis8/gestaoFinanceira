import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { CentroCusto } from 'src/app/models/Centro-Custo';
import { Lancamento } from 'src/app/models/Lancamento';
import { CentroCustoService } from 'src/app/services/centro-custo.service';

@Component({
  selector: 'app-lancamento-form',
  templateUrl: './lancamento-form.component.html',
  styleUrls: ['./lancamento-form.component.css']
})
export class LancamentoFormComponent implements OnInit{
  @Output() onSubmit = new EventEmitter<Lancamento>();
  @Input() btnText!: string;
  @Input() lancamentoData: Lancamento | null = null;
  lancamentoForm!: FormGroup;
  centroCustos: CentroCusto[] = [];

  constructor(private centroCustoService: CentroCustoService ){}

  ngOnInit(): void {
      this.lancamentoForm = new FormGroup({
        id: new FormControl(this.lancamentoData ? this.lancamentoData.id : ''),
        dataHora: new FormControl(this.lancamentoData ? this.lancamentoData.dataHora : '', [Validators.required]),
        valor: new FormControl(this.lancamentoData ? this.lancamentoData.valor : '', [Validators.required]),
        descricao: new FormControl(this.lancamentoData ? this.lancamentoData.descricao : '', [Validators.required]),
        status: new FormControl(this.lancamentoData ? this.lancamentoData.status : '', [Validators.required]),
        idCCusto: new FormControl(this.lancamentoData ? this.lancamentoData.idCCusto : '', [Validators.required]),
      });

      this.centroCustoService.getAllCentroCustos().subscribe((centroCustos) => (this.centroCustos = centroCustos));
  }

  get dataHora(){
    return this.lancamentoForm.get('dataHora')!;
  }

  get valor(){
    return this.lancamentoForm.get('valor')!;
  }

  get descricao(){
    return this.lancamentoForm.get('descricao')!;
  }

  get status(){
    return this.lancamentoForm.get('status')!;
  }

  get idCCusto(){
    return this.lancamentoForm.get('idCCusto')!;
  }

  get idUsuario(){    
    return this.lancamentoForm.get('idUsuario')!;
  }

  submit(){
    if(this.lancamentoForm.invalid){
      return;
    }
    console.log(this.valor);
    this.onSubmit.emit(this.lancamentoForm.value);
  }
}
