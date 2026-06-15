import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfiguracoesIaService } from 'src/app/services/configuracoes-ia/configuracoes-ia.service';
import { MensagensService } from 'src/app/services/mensagens/mensagens.service';
import { ConfiguracoesIA } from 'src/types';

@Component({
  selector: 'app-configuracoes-ia',
  templateUrl: './configuracoes-ia.component.html',
  styleUrls: ['./configuracoes-ia.component.css'],
  standalone: false
})
export class ConfiguracoesIaComponent {

  configuracoesIAForm!: FormGroup;
  public listaConfiguracoesIA: ConfiguracoesIA[] = [];
  @Output() onSubmit = new EventEmitter<ConfiguracoesIA>();

  constructor(private configuracoesIAService: ConfiguracoesIaService, private mensagensService: MensagensService) { }

  ngOnInit(): void {
    this.buscarConfiguracaoIA();

    this.configuracoesIAForm = new FormGroup({
      id: new FormControl(''),
      filtroDataDe: new FormControl('', Validators.required),
      filtroDataAte: new FormControl('', Validators.required),
      prompt: new FormControl('', Validators.required),
      idUsuario: new FormControl('')
    });
  }

  buscarConfiguracaoIA() {
    this.configuracoesIAService.getConfiguracaoIA().subscribe(item => {
      if (!item) {
        return;
      }
      this.configuracoesIAForm.patchValue({
        ...item,
        filtroDataDe: this.formatarData(item.filtroDataDe),
        filtroDataAte: this.formatarData(item.filtroDataAte)
      });
      console.log(this.configuracoesIAForm);
    });
  }

  formatarData(data: string | Date): string {
    if (!data) return '';

    const d = new Date(data);
    return d.toISOString().split('T')[0];
  }

  get id() {
    return this.configuracoesIAForm.get('id')!;
  }

  get filtroDataDe() {
    return this.configuracoesIAForm.get('filtroDataDe')!;
  }

  get filtroDataAte() {
    return this.configuracoesIAForm.get('filtroDataAte')!;
  }

  get prompt() {
    return this.configuracoesIAForm.get('prompt')!;
  }

  get idUsuario() {
    return this.configuracoesIAForm.get('idUsuario')!;
  }

  submit(): void {
    if (this.configuracoesIAForm.invalid) {
      this.configuracoesIAForm.markAllAsTouched();
      return;
    }

    const payload: ConfiguracoesIA = {
      ...this.configuracoesIAForm.value
    };

    const idRegistro = this.id.value;

    this.configuracoesIAService.putConfiguracaoIA(payload, idRegistro)
      .subscribe({
        next: () => {
          this.mensagensService.mensagem('success', undefined, 'Configurações de IA atualizadas com sucesso!', undefined);
        },
        
        error: (error) => {
          this.mensagensService.mensagem('error', undefined, 'O seguinte erro foi apresentado: ${error}', undefined);
        }
      });
  }


}
