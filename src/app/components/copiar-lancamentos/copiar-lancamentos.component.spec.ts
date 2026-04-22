import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopiarLancamentosComponent } from './copiar-lancamentos.component';

describe('CopiarLancamentosComponent', () => {
  let component: CopiarLancamentosComponent;
  let fixture: ComponentFixture<CopiarLancamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopiarLancamentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopiarLancamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
