import { TestBed } from '@angular/core/testing';

import { VerificationTrackingService } from './verification-tracking.service';

describe('VerificationTrackingService', () => {
  let service: VerificationTrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerificationTrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
