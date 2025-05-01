import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LancamentoFixoFormComponent } from './lancamento-fixo-form.component';

describe('LancamentoFixoFormComponent', () => {
  let component: LancamentoFixoFormComponent;
  let fixture: ComponentFixture<LancamentoFixoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LancamentoFixoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LancamentoFixoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
