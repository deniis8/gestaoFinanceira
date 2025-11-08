import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CentroCustoService } from 'src/app/services/cetro-custo/centro-custo.service';
import { CentroCusto } from 'src/types';

@Component({
  selector: 'app-centro-custo-form',
  templateUrl: './centro-custo-form.component.html',
  styleUrl: './centro-custo-form.component.css',
  standalone: false
})
export class CentroCustoFormComponent implements OnInit{
  @Output() onSubmit = new EventEmitter<CentroCusto>();
  @Input() btnText!: string;
  @Input() centroCustoData: CentroCusto | null = null;
  centroCustoForm!: FormGroup;
  centroCustos: CentroCusto[] = [];

  constructor(private centroCustoService: CentroCustoService ){}

  ngOnInit(): void {
      this.centroCustoForm = new FormGroup({
        id: new FormControl(this.centroCustoData ? this.centroCustoData.id : ''),
        descriCCusto: new FormControl(this.centroCustoData ? this.centroCustoData.descriCCusto : '', [Validators.required]),
      });
  }

  get descriCCusto(){
    return this.centroCustoForm.get('descriCCusto')!;
  }

  submit(){
    if(this.centroCustoForm.invalid){
      return;
    }
    this.onSubmit.emit(this.centroCustoForm.value);
  }
}
