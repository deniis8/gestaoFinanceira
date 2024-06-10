import { TestBed } from '@angular/core/testing';

import { ClimaAmbienteService } from './clima-ambiente.service';

describe('ClimaAmbienteService', () => {
  let service: ClimaAmbienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClimaAmbienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
