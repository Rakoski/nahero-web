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

export enum QuestionType {
  MULTIPLE_CHOICE = 1,
  TRUE_FALSE = 2,
  OBJECTIVE = 3,
  DESCRIPTIVE = 4,
  SUM = 5,
}

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
  descriptiveAnswers: Map<string, string> = new Map();
  sumAnswers: Map<string, number> = new Map();

  timeRemaining: number = 0;
  timerInterval: any;

  isLoading: boolean = true;
  loadingMessage: string = 'Carregando simulado...';
  error: string | null = null;
  examSubmitted: boolean = false;

  questionsPerPage: number = 15;
  questionPageIndex: number = 0;

  QuestionType = QuestionType;

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

            if (question.questionType?.id === QuestionType.DESCRIPTIVE) {
              this.descriptiveAnswers.set(question.id, '');
            } else if (question.questionType?.id === QuestionType.SUM) {
              this.sumAnswers.set(question.id, 0);
            }
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

  loadAlternativesForCurrentQuestion(): void {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) return;

    if (this.needsAlternatives(currentQuestion.questionType?.id)) {
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
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startTimer(): void {
    if (!this.timeRemaining) {
      const timeLimit = this.practiceExam?.timeLimit || 60;
      this.timeRemaining = timeLimit * 60;
    }

    this.timerInterval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        clearInterval(this.timerInterval);
        this.submitExam();
      }
    }, 1000);
  }

  formatTime(unused?: number): string {
    const totalSeconds = this.timeRemaining;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
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

  needsAlternatives(questionTypeid: number): boolean {
    return [QuestionType.MULTIPLE_CHOICE, QuestionType.TRUE_FALSE, QuestionType.OBJECTIVE].includes(
      questionTypeid
    );
  }

  isMultipleChoice(question: ListQuestionsByStudentResponse): boolean {
    return question.questionType?.id === QuestionType.MULTIPLE_CHOICE;
  }

  isTrueFalse(question: ListQuestionsByStudentResponse): boolean {
    return question.questionType?.id === QuestionType.TRUE_FALSE;
  }

  isObjective(question: ListQuestionsByStudentResponse): boolean {
    return question.questionType?.id === QuestionType.OBJECTIVE;
  }

  isDescriptive(question: ListQuestionsByStudentResponse): boolean {
    return question.questionType?.id === QuestionType.DESCRIPTIVE;
  }

  isSum(question: ListQuestionsByStudentResponse): boolean {
    return question.questionType?.id === QuestionType.SUM;
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
    } else if (this.isTrueFalse(currentQuestion) || this.isObjective(currentQuestion)) {
      this.selectedAnswers.set(questionId, [alternativeId]);
    }
  }

  saveDescriptiveAnswer(questionId: string, answerText: string): void {
    this.descriptiveAnswers.set(questionId, answerText);
  }

  saveSumAnswer(questionId: string, value: number): void {
    this.sumAnswers.set(questionId, value);
  }

  isSelected(questionId: string, alternativeId: string): boolean {
    const answers = this.selectedAnswers.get(questionId) || [];
    return answers.includes(alternativeId);
  }

  getVisibleQuestions(): ListQuestionsByStudentResponse[] {
    const startIndex = this.questionPageIndex * this.questionsPerPage;
    const endIndex = Math.min(startIndex + this.questionsPerPage, this.questions.length);
    return this.questions.slice(startIndex, endIndex);
  }

  previousQuestionPage(): void {
    if (this.questionPageIndex > 0) {
      this.questionPageIndex--;
    }
  }

  nextQuestionPage(): void {
    const maxPage = Math.ceil(this.questions.length / this.questionsPerPage) - 1;
    if (this.questionPageIndex < maxPage) {
      this.questionPageIndex++;
    }
  }

  goToQuestion(index: number): void {
    if (index >= 0 && index < this.questions.length) {
      this.currentQuestionIndex = index;
      this.questionPageIndex = Math.floor(index / this.questionsPerPage);
      this.loadAlternativesForCurrentQuestion();
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
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
      const newPageIndex = Math.floor(this.currentQuestionIndex / this.questionsPerPage);
      if (newPageIndex !== this.questionPageIndex) {
        this.questionPageIndex = newPageIndex;
      }
      this.loadAlternativesForCurrentQuestion();
    }
  }

  hasAnswered(questionId: string): boolean {
    const question = this.questions.find((q) => q.id === questionId);
    if (!question) return false;

    switch (question.questionType?.id) {
      case QuestionType.MULTIPLE_CHOICE:
      case QuestionType.OBJECTIVE:
      case QuestionType.TRUE_FALSE:
        const answers = this.selectedAnswers.get(questionId) || [];
        return answers.length > 0;
      case QuestionType.DESCRIPTIVE:
        const descriptiveAnswer = this.descriptiveAnswers.get(questionId) || '';
        return descriptiveAnswer.trim().length > 0;
      case QuestionType.SUM:
        return this.sumAnswers.has(questionId);
      default:
        return false;
    }
  }

  submitExam(): void {
    if (this.examSubmitted) return;

    this.isLoading = true;
    this.loadingMessage = 'Enviando respostas...';

    if (this.attemptId && this.attemptId !== this.practiceExamId) {
      this.finishExistingAttempt();
    } else {
      this.createAndFinishAttempt();
    }
  }

  private createAndFinishAttempt(): void {
    this.http
      .post<number>(`${API_URL}student-practice-attempts`, {
        practiceExamId: this.practiceExamId,
      })
      .subscribe({
        next: (attemptId) => {
          this.attemptId = attemptId.toString();
          this.finishExistingAttempt();
        },
        error: (error) => {
          console.error('Error creating attempt:', error);
          this.error = 'Erro ao criar tentativa do simulado. Por favor, tente novamente.';
          this.isLoading = false;
        },
      });
  }

  private finishExistingAttempt(): void {
    const answers = this.prepareAnswers();

    this.http
      .put<boolean>(`${API_URL}student-practice-attempts/finish`, {
        studentPracticeAttemptId: parseInt(this.attemptId!),
        answers: answers,
      })
      .subscribe({
        next: (approved) => {
          this.examSubmitted = true;
          this.isLoading = false;
          this.router.navigate(['/student/practice-attempt/results', this.attemptId, approved]);
        },
        error: (error) => {
          console.error('Error finishing exam:', error);
          this.error = 'Erro ao enviar respostas. Por favor, tente novamente.';
          this.isLoading = false;
        },
      });
  }

  private prepareAnswers() {
    return this.questions.map((question) => {
      let answerData: any = { questionId: question.id };

      switch (question.questionType?.id) {
        case QuestionType.MULTIPLE_CHOICE:
        case QuestionType.OBJECTIVE:
        case QuestionType.TRUE_FALSE:
          answerData.alternativeIds = this.selectedAnswers.get(question.id) || [];
          break;
        case QuestionType.DESCRIPTIVE:
          answerData.descriptiveAnswer = this.descriptiveAnswers.get(question.id) || '';
          break;
        case QuestionType.SUM:
          answerData.sumAnswer = this.sumAnswers.get(question.id) || null;
          break;
      }

      return answerData;
    });
  }
}
