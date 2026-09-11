import { TestBed } from '@angular/core/testing';

import { VisaApplicationService } from './visa-application.service';

describe('VisaApplicationService', () => {
  let service: VisaApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisaApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
