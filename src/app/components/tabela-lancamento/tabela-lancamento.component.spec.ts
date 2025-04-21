import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaLancamentoComponent } from './tabela-lancamento.component';

describe('TabelaLancamentoComponent', () => {
  let component: TabelaLancamentoComponent;
  let fixture: ComponentFixture<TabelaLancamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabelaLancamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabelaLancamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
