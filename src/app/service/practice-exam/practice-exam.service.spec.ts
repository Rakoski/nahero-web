import { TestBed } from '@angular/core/testing';
import { PracticeExamService } from './practice-exam.service';

describe('PracticeExamService', () => {
  let service: PracticeExamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PracticeExamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
