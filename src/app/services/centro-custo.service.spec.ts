import { TestBed } from '@angular/core/testing';

import { CentroCustoService } from './centro-custo.service';

describe('CentroCustoService', () => {
  let service: CentroCustoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CentroCustoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
