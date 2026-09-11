import { TestBed } from '@angular/core/testing';

import { TemporaryLossApplicationService } from './temporary-loss-application.service';

describe('TemporaryLossApplicationService', () => {
  let service: TemporaryLossApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemporaryLossApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
