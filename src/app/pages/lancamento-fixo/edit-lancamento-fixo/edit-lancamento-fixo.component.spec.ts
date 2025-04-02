import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLancamentoFixoComponent } from './edit-lancamento-fixo.component';

describe('EditLancamentoFixoComponent', () => {
  let component: EditLancamentoFixoComponent;
  let fixture: ComponentFixture<EditLancamentoFixoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLancamentoFixoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLancamentoFixoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
