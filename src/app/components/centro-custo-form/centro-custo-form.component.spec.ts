import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentroCustoFormComponent } from './centro-custo-form.component';

describe('CentroCustoFormComponent', () => {
  let component: CentroCustoFormComponent;
  let fixture: ComponentFixture<CentroCustoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentroCustoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentroCustoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
