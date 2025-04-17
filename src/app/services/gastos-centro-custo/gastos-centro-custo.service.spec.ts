import { TestBed } from '@angular/core/testing';

import { GastosCentroCustoService } from './gastos-centro-custo.service';

describe('GastosCentroCustoService', () => {
  let service: GastosCentroCustoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GastosCentroCustoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
