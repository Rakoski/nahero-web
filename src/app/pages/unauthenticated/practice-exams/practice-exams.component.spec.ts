import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeExamsComponent } from './practice-exams.component';

describe('PracticeExamsComponent', () => {
  let component: PracticeExamsComponent;
  let fixture: ComponentFixture<PracticeExamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeExamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticeExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
