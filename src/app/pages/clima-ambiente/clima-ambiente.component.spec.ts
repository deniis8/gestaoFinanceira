import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClimaAmbienteComponent } from './clima-ambiente.component';

describe('ClimaAmbienteComponent', () => {
  let component: ClimaAmbienteComponent;
  let fixture: ComponentFixture<ClimaAmbienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClimaAmbienteComponent]
    });
    fixture = TestBed.createComponent(ClimaAmbienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
