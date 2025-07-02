import { TestBed } from '@angular/core/testing';

import { ParametrosSistemaService } from './parametros.sistema.services';

describe('ParametrosSistema', () => {
  let service: ParametrosSistemaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParametrosSistemaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
