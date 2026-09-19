import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MensagensService } from 'src/app/services/mensagens/mensagens.service';
import { IconComponent } from '../icon/icon.component';
import { SheetComponent } from '../sheet/sheet.component';

/** Único lugar que desenha os toasts e o diálogo de confirmação do MensagensService. */
@Component({
  selector: 'app-feedback-host',
  imports: [IconComponent, SheetComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toasts" role="region" aria-label="Avisos">
      @for (toast of mensagens.toasts(); track toast.id) {
        <div class="toast" [class]="toast.tipo" [attr.role]="toast.tipo === 'erro' ? 'alert' : 'status'">
          <app-icon [nome]="toast.tipo === 'sucesso' ? 'ok' : 'alerta'" />
          <p>{{ toast.texto }}</p>
          <button type="button" class="btn btn-quiet btn-icon btn-sm" aria-label="Dispensar aviso"
                  (click)="mensagens.descartar(toast.id)">
            <app-icon nome="fechar" />
          </button>
        </div>
      }
    </div>

    @if (mensagens.confirmacao(); as confirmacao) {
      <app-sheet [titulo]="confirmacao.titulo" [pequeno]="true" (fechar)="mensagens.responder(false)">
        <p class="texto-2">{{ confirmacao.texto }}</p>
        <ng-container rodape>
          @if (confirmacao.cancelar) {
            <button type="button" class="btn btn-quiet" (click)="mensagens.responder(false)">{{ confirmacao.cancelar }}</button>
          }
          <button type="button" class="btn" [class.btn-danger]="confirmacao.perigo" [class.btn-primary]="!confirmacao.perigo"
                  (click)="mensagens.responder(true)">{{ confirmacao.confirmar }}</button>
        </ng-container>
      </app-sheet>
    }
  `,
  styleUrl: './feedback-host.component.css'
})
export class FeedbackHostComponent {
  mensagens = inject(MensagensService);
}
