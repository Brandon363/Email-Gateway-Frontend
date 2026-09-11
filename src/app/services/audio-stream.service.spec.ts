import { TestBed } from '@angular/core/testing';

import { AudioStreamService } from './audio-stream.service';

describe('AudioStreamService', () => {
  let service: AudioStreamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioStreamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
