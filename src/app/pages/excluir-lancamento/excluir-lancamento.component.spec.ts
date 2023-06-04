import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcluirLancamentoComponent } from './excluir-lancamento.component';

describe('ExcluirLancamentoComponent', () => {
  let component: ExcluirLancamentoComponent;
  let fixture: ComponentFixture<ExcluirLancamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcluirLancamentoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcluirLancamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
