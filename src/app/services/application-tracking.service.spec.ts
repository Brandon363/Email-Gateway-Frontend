import { TestBed } from '@angular/core/testing';

import { ApplicationTrackingService } from './application-tracking.service';

describe('ApplicationTrackingService', () => {
  let service: ApplicationTrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationTrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
