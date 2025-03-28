import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';
import { PracticeExam } from '../../model/nahero.type';
import {
  UbDialogCloseDirective,
  UbDialogContentDirective,
  UbDialogDescriptionDirective,
  UbDialogFooterDirective,
  UbDialogHeaderDirective,
  UbDialogTitleDirective,
  UbDialogTriggerDirective,
} from '@/components/ui/dialog';
import { ButtonComponent } from '../button/button.component';
import { getDifficultyLabel } from '../../../lib/utils';

interface CreateStudentPracticeAttemptRequest {
  practiceExamId: number;
}

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    UbDialogCloseDirective,
    UbDialogContentDirective,
    UbDialogDescriptionDirective,
    UbDialogFooterDirective,
    UbDialogHeaderDirective,
    UbDialogTitleDirective,
    UbDialogTriggerDirective,
  ],
  templateUrl: './dialog.component.html',
  styles: [],
})
export class DialogComponent {
  @Input() practiceExam!: PracticeExam;

  isLoading: boolean = false;
  errorMessage: string = '';
  getDifficultyLabel = getDifficultyLabel;

  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  handleTriggerClick(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return;
    }
  }

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

    this.http.post<number>('/api/student-practice-attempts', payload).subscribe({
      next: (attemptId) => {
        this.isLoading = false;
        this.router.navigate(['/simulados/attempt', attemptId]);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Erro ao iniciar o simulado. Tente novamente.';
        console.error('Error starting exam:', error);
      },
    });
  }
}
