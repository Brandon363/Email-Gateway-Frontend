import { TestBed } from '@angular/core/testing';

import { ExtractedVisaApplicationService } from './extracted-visa-application.service';

describe('ExtractedVisaApplicationService', () => {
  let service: ExtractedVisaApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtractedVisaApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
