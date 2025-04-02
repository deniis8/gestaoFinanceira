import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaLancamentoFixoComponent } from './tabela-lancamento-fixo.component';

describe('TabelaLancamentoFixoComponent', () => {
  let component: TabelaLancamentoFixoComponent;
  let fixture: ComponentFixture<TabelaLancamentoFixoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabelaLancamentoFixoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabelaLancamentoFixoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
