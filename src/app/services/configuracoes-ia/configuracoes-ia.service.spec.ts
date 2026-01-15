import { TestBed } from '@angular/core/testing';

import { ConfiguracoesIaService } from './configuracoes-ia.service';

describe('ConfiguracoesIaService', () => {
  let service: ConfiguracoesIaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfiguracoesIaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
