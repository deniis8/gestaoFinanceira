import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracoesIaComponent } from './configuracoes-ia.component';

describe('ConfiguracoesIaComponent', () => {
  let component: ConfiguracoesIaComponent;
  let fixture: ComponentFixture<ConfiguracoesIaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracoesIaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguracoesIaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
