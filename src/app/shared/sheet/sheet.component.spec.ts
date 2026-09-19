import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SheetComponent } from './sheet.component';

@Component({
  imports: [SheetComponent],
  template: `
    @if (aberto) {
      <app-sheet titulo="Mais opções" (fechar)="aberto = false; fechou = fechou + 1">
        <button type="button" id="dentro">Dentro</button>
      </app-sheet>
    }
  `
})
class HostComponent {
  aberto = true;
  fechou = 0;
}

describe('SheetComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  const painel = () => fixture.nativeElement.querySelector('[role=dialog]') as HTMLElement | null;
  const teclar = (key: string) => document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('mostra o painel com título e trava a rolagem da página', () => {
    expect(painel()).not.toBeNull();
    expect(painel()!.getAttribute('aria-modal')).toBe('true');
    expect(painel()!.textContent).toContain('Mais opções');
    expect(document.documentElement.classList.contains('sheet-aberto')).toBeTrue();
  });

  it('emite fechar ao apertar Esc e libera a rolagem quando sai da tela', () => {
    teclar('Escape');
    fixture.detectChanges();

    expect(fixture.componentInstance.fechou).toBe(1);
    expect(painel()).toBeNull();
    expect(document.documentElement.classList.contains('sheet-aberto')).toBeFalse();
  });

  it('emite fechar ao clicar no fundo', () => {
    (fixture.nativeElement.querySelector('.fundo') as HTMLElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.fechou).toBe(1);
  });

  it('emite fechar pelo botão de fechar', () => {
    (fixture.nativeElement.querySelector('button[aria-label=Fechar]') as HTMLElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.fechou).toBe(1);
  });
});
