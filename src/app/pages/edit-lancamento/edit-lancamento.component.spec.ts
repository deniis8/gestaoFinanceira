import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLancamentoComponent } from './edit-lancamento.component';

describe('EditLancamentoComponent', () => {
  let component: EditLancamentoComponent;
  let fixture: ComponentFixture<EditLancamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLancamentoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLancamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
