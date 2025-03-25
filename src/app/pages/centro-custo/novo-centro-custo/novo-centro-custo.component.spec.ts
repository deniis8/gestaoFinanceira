import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovoCentroCustoComponent } from './novo-centro-custo.component';

describe('NovoCentroCustoComponent', () => {
  let component: NovoCentroCustoComponent;
  let fixture: ComponentFixture<NovoCentroCustoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovoCentroCustoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovoCentroCustoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
