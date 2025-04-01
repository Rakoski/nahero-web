import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import {
  UbCardDirective,
  UbCardHeaderDirective,
  UbCardTitleDirective,
  UbCardDescriptionDirective,
  UbCardContentDirective,
  UbCardFooterDirective,
} from '@/components/ui/card';
import { UbButtonDirective } from '@/components/ui/button';
import {
  UbDialogCloseDirective,
  UbDialogContentDirective,
  UbDialogDescriptionDirective,
  UbDialogFooterDirective,
  UbDialogHeaderDirective,
  UbDialogTitleDirective,
  UbDialogTriggerDirective,
} from '@/components/ui/dialog';
import { PracticeExam } from '../../../model/nahero.type';
import { formatTimeLimit, getDifficultyLabel } from '../../../../lib/utils';
import { AuthService } from '../../../service/auth/auth.service';
import { API_URL } from '../../../../constants';

interface CreateStudentPracticeAttemptRequest {
  practiceExamId: number;
}

@Component({
  selector: 'app-practice-exam-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UbCardDirective,
    UbCardHeaderDirective,
    UbCardTitleDirective,
    UbCardDescriptionDirective,
    UbCardContentDirective,
    UbCardFooterDirective,
    UbButtonDirective,
    UbDialogCloseDirective,
    UbDialogContentDirective,
    UbDialogDescriptionDirective,
    UbDialogFooterDirective,
    UbDialogHeaderDirective,
    UbDialogTitleDirective,
    UbDialogTriggerDirective,
  ],
  templateUrl: './practice-exam-card.component.html',
  styleUrl: './practice-exam-card.component.scss',
})
export class PracticeExamCardComponent {
  @Input() practiceExam!: PracticeExam;
  isLoading: boolean = false;
  errorMessage: string = '';

  getDifficultyLabel = getDifficultyLabel;
  formatTimeLimit = formatTimeLimit;

  private http = inject(HttpClient);
  private authService = inject(AuthService);

  constructor(public router: Router) {}

  startExam(practiceExamId: string): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload: CreateStudentPracticeAttemptRequest = {
      practiceExamId: Number(practiceExamId),
    };

    this.http.post<number>(API_URL + 'student-practice-attempts', payload).subscribe({
      next: (attemptId) => {
        this.isLoading = false;
        this.router.navigate(['/practice-exams/attempt', attemptId]);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Erro ao iniciar o simulado. Tente novamente.';
        console.error('Error starting exam:', error);
      },
    });
  }
}
