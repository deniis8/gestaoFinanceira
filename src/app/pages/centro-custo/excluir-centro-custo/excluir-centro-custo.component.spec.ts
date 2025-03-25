import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcluirCentroCustoComponent } from './excluir-centro-custo.component';

describe('ExcluirCentroCustoComponent', () => {
  let component: ExcluirCentroCustoComponent;
  let fixture: ComponentFixture<ExcluirCentroCustoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcluirCentroCustoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcluirCentroCustoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
