import { TestBed } from '@angular/core/testing';

import { LancamentoFixoService } from './lancamento-fixo.service';

describe('LancamentoFixoService', () => {
  let service: LancamentoFixoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LancamentoFixoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
