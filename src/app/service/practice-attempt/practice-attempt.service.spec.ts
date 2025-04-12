import { TestBed } from '@angular/core/testing';

import { PracticeAttemptService } from './practice-attempt.service';

describe('PracticeAttemptService', () => {
  let service: PracticeAttemptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PracticeAttemptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
