import { TestBed } from '@angular/core/testing';

import { FreeTextTestService } from './free-text-test.service';

describe('FreeTextTestService', () => {
  let service: FreeTextTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FreeTextTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
