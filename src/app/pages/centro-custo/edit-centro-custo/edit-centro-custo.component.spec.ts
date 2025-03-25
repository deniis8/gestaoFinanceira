import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCentroCustoComponent } from './edit-centro-custo.component';

describe('EditCentroCustoComponent', () => {
  let component: EditCentroCustoComponent;
  let fixture: ComponentFixture<EditCentroCustoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCentroCustoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCentroCustoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
