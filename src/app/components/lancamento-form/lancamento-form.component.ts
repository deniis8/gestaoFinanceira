import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { CentroCusto } from 'src/app/Centro-Custo';
import { Lancamento } from 'src/app/Lancamento';
import { CentroCustoService } from 'src/app/services/centro-custo.service';

@Component({
  selector: 'app-lancamento-form',
  templateUrl: './lancamento-form.component.html',
  styleUrls: ['./lancamento-form.component.css']
})
export class LancamentoFormComponent implements OnInit{
  @Output() onSubmit = new EventEmitter<Lancamento>();
  @Input() btnText!: string;
  lancamentoForm!: FormGroup;
  centroCustos: CentroCusto[] = [];

  constructor(private centroCustoService: CentroCustoService ){}

  ngOnInit(): void {
      this.lancamentoForm = new FormGroup({
        id: new FormControl(''),
        dataHora: new FormControl('', [Validators.required]),
        valor: new FormControl('', [Validators.required]),
        descricao: new FormControl('', [Validators.required]),
        status: new FormControl('', [Validators.required]),
        idCCusto: new FormControl('', [Validators.required]),
        //idUsuario: new FormControl('', [Validators.required]),
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
    //console.log("Enviou formulário")!;
    console.log(this.valor);
    this.onSubmit.emit(this.lancamentoForm.value);
  }
}
