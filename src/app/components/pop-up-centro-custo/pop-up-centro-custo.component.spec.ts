import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpCentroCustoComponent } from './pop-up-centro-custo.component';

describe('PopUpCentroCustoComponent', () => {
  let component: PopUpCentroCustoComponent;
  let fixture: ComponentFixture<PopUpCentroCustoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpCentroCustoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpCentroCustoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
