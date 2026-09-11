import { TestBed } from '@angular/core/testing';

import { ExtractedUserService } from './extracted-user.service';

describe('ExtractedUserService', () => {
  let service: ExtractedUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtractedUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
