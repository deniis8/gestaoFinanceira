import { Component, ViewEncapsulation, computed, inject, input, output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SheetComponent } from 'src/app/shared/sheet/sheet.component';

@Component({
  selector: 'app-pop-up-ia',
  imports: [SheetComponent],
  encapsulation: ViewEncapsulation.None, // o HTML da IA não recebe os atributos de escopo
  template: `
    <app-sheet titulo="Insight da IA" (fechar)="fechar.emit()">
      <div class="conteudo-ia" [innerHTML]="html()"></div>
    </app-sheet>
  `,
  styleUrl: './pop-up-ia.component.css'
})
export class PopUpIaComponent {
  private sanitizer = inject(DomSanitizer);

  /** HTML devolvido pela API de análise financeira (conteúdo da própria API do usuário). */
  analise = input.required<string>();
  fechar = output<void>();

  html = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.analise()));
}
