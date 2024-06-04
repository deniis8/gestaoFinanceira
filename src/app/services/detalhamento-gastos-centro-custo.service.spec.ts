import { TestBed } from '@angular/core/testing';

import { DetalhamentoGastosCentroCustoService } from './detalhamento-gastos-centro-custo.service';

describe('DetalhamentoGastosCentroCustoService', () => {
  let service: DetalhamentoGastosCentroCustoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetalhamentoGastosCentroCustoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
