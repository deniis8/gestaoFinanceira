import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaCentroCustoComponent } from './tabela-centro-custo.component';

describe('TabelaCentroCustoComponent', () => {
  let component: TabelaCentroCustoComponent;
  let fixture: ComponentFixture<TabelaCentroCustoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabelaCentroCustoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabelaCentroCustoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
