import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcluirLancamentoFixoComponent } from './excluir-lancamento-fixo.component';

describe('ExcluirLancamentoFixoComponent', () => {
  let component: ExcluirLancamentoFixoComponent;
  let fixture: ComponentFixture<ExcluirLancamentoFixoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcluirLancamentoFixoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcluirLancamentoFixoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
