import { TestBed } from '@angular/core/testing';

import { GastosMensaisService } from './gastos-mensais.service';

describe('GastosMensaisService', () => {
  let service: GastosMensaisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GastosMensaisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
