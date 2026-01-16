import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpIaComponent } from './pop-up-ia.component';

describe('PopUpIaComponent', () => {
  let component: PopUpIaComponent;
  let fixture: ComponentFixture<PopUpIaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpIaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpIaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
