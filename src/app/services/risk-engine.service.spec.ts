import { TestBed } from '@angular/core/testing';

import { RiskEngineService } from './risk-engine.service';

describe('RiskEngineService', () => {
  let service: RiskEngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskEngineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
