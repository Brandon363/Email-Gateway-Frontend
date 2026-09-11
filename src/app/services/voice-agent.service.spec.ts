import { TestBed } from '@angular/core/testing';

import { VoiceAgentService } from './voice-agent.service';

describe('VoiceAgentService', () => {
  let service: VoiceAgentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoiceAgentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
