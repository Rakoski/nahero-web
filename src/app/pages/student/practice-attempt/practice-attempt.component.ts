import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Alternative,
  ListQuestionsByStudentResponse,
  PracticeExam,
} from '../../../model/nahero.type';
import { API_URL } from '../../../../constants';
import { UbButtonDirective } from '@/components/ui/button';

@Component({
  selector: 'app-practice-attempt',
  standalone: true,
  imports: [CommonModule, FormsModule, UbButtonDirective],
  templateUrl: './practice-attempt.component.html',
  styleUrl: './practice-attempt.component.scss',
})
export class PracticeAttemptComponent implements OnInit, OnDestroy {
  attemptId: string | null = null;
  practiceExamId: string | null = null;
  practiceExam: PracticeExam | null = null;
  questions: ListQuestionsByStudentResponse[] = [];
  questionAlternatives: Map<string, Alternative[]> = new Map();

  currentQuestionIndex: number = 0;
  selectedAnswers: Map<string, string[]> = new Map();

  timeRemaining: number = 0;
  timerInterval: any;

  isLoading: boolean = true;
  loadingMessage: string = 'Carregando simulado...';
  error: string | null = null;
  examSubmitted: boolean = false;

  // New properties for pagination
  questionsPerPage: number = 15;
  questionPageIndex: number = 0;

  constructor(private route: ActivatedRoute, public router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.attemptId = this.route.snapshot.paramMap.get('attemptId');

    if (!this.attemptId) {
      this.error = 'ID do simulado não encontrado';
      this.isLoading = false;
      return;
    }

    this.practiceExamId = this.attemptId;
    this.timeRemaining = 3600;
    this.startTimer();

    this.http
      .get<ListQuestionsByStudentResponse[]>(
        `${API_URL}questions/list-student/${this.practiceExamId}`
      )
      .subscribe({
        next: (questions) => {
          this.questions = questions;

          if (questions.length === 0) {
            this.isLoading = false;
            return;
          }

          this.questions.forEach((question) => {
            this.selectedAnswers.set(question.id, []);
          });

          this.loadAlternativesForCurrentQuestion();

          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading questions:', error);
          this.error = 'Erro ao carregar questões do simulado. Por favor, tente novamente.';
          this.isLoading = false;
        },
      });
  }

  /**
   * Load alternatives only for the currently displayed question
   * to avoid fetching all alternatives at once
   */
  loadAlternativesForCurrentQuestion(): void {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) return;

    const questionId = currentQuestion.id;

    if (this.questionAlternatives.has(questionId)) return;

    this.loadingMessage = 'Carregando alternativas...';

    this.http.get<Alternative[]>(`${API_URL}alternatives/${questionId}`).subscribe({
      next: (alternatives) => {
        this.questionAlternatives.set(questionId, alternatives);
        this.loadingMessage = 'Carregando simulado...';
      },
      error: (error) => {
        console.error(`Error loading alternatives for question ${questionId}:`, error);
        this.questionAlternatives.set(questionId, []);
        this.loadingMessage = 'Carregando simulado...';
      },
    });
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startTimer(): void {
    if (!this.practiceExam?.timeLimit) return;

    this.timerInterval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        this.submitExam();
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }

  getCurrentQuestion(): ListQuestionsByStudentResponse | null {
    if (this.questions.length === 0) return null;
    return this.questions[this.currentQuestionIndex];
  }

  getAlternativesForCurrentQuestion(): Alternative[] {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) return [];

    return this.questionAlternatives.get(currentQuestion.id) || [];
  }

  isMultipleChoice(question: ListQuestionsByStudentResponse): boolean {
    return question.questionTypeId === 1;
  }

  isObjective(question: ListQuestionsByStudentResponse): boolean {
    return question.questionTypeId === 3;
  }

  toggleAnswer(questionId: string, alternativeId: string): void {
    const currentAnswers = this.selectedAnswers.get(questionId) || [];
    const currentQuestion = this.questions.find((q) => q.id === questionId);

    if (!currentQuestion) return;

    if (this.isMultipleChoice(currentQuestion)) {
      if (currentAnswers.includes(alternativeId)) {
        this.selectedAnswers.set(
          questionId,
          currentAnswers.filter((id) => id !== alternativeId)
        );
      } else {
        this.selectedAnswers.set(questionId, [...currentAnswers, alternativeId]);
      }
    } else {
      this.selectedAnswers.set(questionId, [alternativeId]);
    }
  }

  isSelected(questionId: string, alternativeId: string): boolean {
    const answers = this.selectedAnswers.get(questionId) || [];
    return answers.includes(alternativeId);
  }

  // New method for question pagination
  getVisibleQuestions(): ListQuestionsByStudentResponse[] {
    const startIndex = this.questionPageIndex * this.questionsPerPage;
    const endIndex = Math.min(startIndex + this.questionsPerPage, this.questions.length);
    return this.questions.slice(startIndex, endIndex);
  }

  // New method to handle previous page of questions
  previousQuestionPage(): void {
    if (this.questionPageIndex > 0) {
      this.questionPageIndex--;
    }
  }

  // New method to handle next page of questions
  nextQuestionPage(): void {
    const maxPage = Math.ceil(this.questions.length / this.questionsPerPage) - 1;
    if (this.questionPageIndex < maxPage) {
      this.questionPageIndex++;
    }
  }

  // Updated goToQuestion method
  goToQuestion(index: number): void {
    if (index >= 0 && index < this.questions.length) {
      this.currentQuestionIndex = index;

      // Update the pagination to show the current question
      this.questionPageIndex = Math.floor(index / this.questionsPerPage);

      this.loadAlternativesForCurrentQuestion();
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;

      // Update pagination when changing questions
      const newPageIndex = Math.floor(this.currentQuestionIndex / this.questionsPerPage);
      if (newPageIndex !== this.questionPageIndex) {
        this.questionPageIndex = newPageIndex;
      }

      this.loadAlternativesForCurrentQuestion();
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;

      // Update pagination when changing questions
      const newPageIndex = Math.floor(this.currentQuestionIndex / this.questionsPerPage);
      if (newPageIndex !== this.questionPageIndex) {
        this.questionPageIndex = newPageIndex;
      }

      this.loadAlternativesForCurrentQuestion();
    }
  }

  hasAnswered(questionId: string): boolean {
    const answers = this.selectedAnswers.get(questionId) || [];
    return answers.length > 0;
  }

  submitExam(): void {
    if (this.examSubmitted) return;

    this.isLoading = true;
    this.loadingMessage = 'Enviando respostas...';

    this.http
      .post<number>(`${API_URL}student-practice-attempts`, {
        practiceExamId: this.practiceExamId,
      })
      .subscribe({
        next: (attemptId) => {
          this.attemptId = attemptId.toString();

          const answers = Array.from(this.selectedAnswers.entries()).map(
            ([questionId, alternativeIds]) => ({
              questionId,
              alternativeIds,
            })
          );

          this.http
            .post(`${API_URL}student-practice-attempts/${this.attemptId}/submit`, {
              answers,
            })
            .subscribe({
              next: () => {
                this.examSubmitted = true;
                this.isLoading = false;

                this.router.navigate(['/student/practice-attempt/results', this.attemptId]);
              },
              error: (error) => {
                console.error('Error submitting exam:', error);
                this.error = 'Erro ao enviar respostas. Por favor, tente novamente.';
                this.isLoading = false;
              },
            });
        },
        error: (error) => {
          console.error('Error creating attempt:', error);
          this.error = 'Erro ao criar tentativa do simulado. Por favor, tente novamente.';
          this.isLoading = false;
        },
      });
  }
}
