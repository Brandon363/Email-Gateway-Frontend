import { TestBed } from '@angular/core/testing';

import { DocumentAgentService } from './document-agent.service';

describe('DocumentAgentService', () => {
  let service: DocumentAgentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentAgentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
