import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeAttemptComponent } from './practice-attempt.component';

describe('PracticeAttemptComponent', () => {
  let component: PracticeAttemptComponent;
  let fixture: ComponentFixture<PracticeAttemptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeAttemptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticeAttemptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
