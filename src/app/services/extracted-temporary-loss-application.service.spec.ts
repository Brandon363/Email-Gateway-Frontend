import { TestBed } from '@angular/core/testing';

import { ExtractedTemporaryLossApplicationService } from './extracted-temporary-loss-application.service';

describe('ExtractedTemporaryLossApplicationService', () => {
  let service: ExtractedTemporaryLossApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtractedTemporaryLossApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
