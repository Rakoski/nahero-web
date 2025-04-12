import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeExamCardComponent } from './practice-exam-card.component';

describe('PracticeExamCardComponent', () => {
  let component: PracticeExamCardComponent;
  let fixture: ComponentFixture<PracticeExamCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeExamCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticeExamCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
