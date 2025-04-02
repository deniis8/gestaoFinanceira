import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovoLancamentoFixoComponent } from './novo-lancamento-fixo.component';

describe('NovoLancamentoFixoComponent', () => {
  let component: NovoLancamentoFixoComponent;
  let fixture: ComponentFixture<NovoLancamentoFixoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovoLancamentoFixoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovoLancamentoFixoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
