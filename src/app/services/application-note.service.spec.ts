import { TestBed } from '@angular/core/testing';

import { ApplicationNoteService } from './application-note.service';

describe('ApplicationNoteService', () => {
  let service: ApplicationNoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationNoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
