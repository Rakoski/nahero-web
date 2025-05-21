import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UbButtonDirective } from '../../../../../components/ui/button';
import { QuestionType, ResultsResponse } from '../../../../model/nahero.type';
import { API_URL } from '../../../../../constants';
import { getQuestionTypeLabel } from '../../../../../lib/utils';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, UbButtonDirective],
  templateUrl: './results.component.html',
})
export class ResultsComponent implements OnInit {
  attemptId: string | null = null;
  passed: boolean = false;
  results: ResultsResponse | null = null;
  practiceExamId: number | null = null;
  isLoading: boolean = true;
  error: string | null = null;
  correctPercentage: number = 0;
  incorrectPercentage: number = 0;
  showAllQuestions: boolean = true;
  showCorrectAnswers: boolean = false;
  showIncorrectAnswers: boolean = false;
  currentPage: number = 1;
  questionsPerPage: number = 5;
  QuestionType = QuestionType;

  constructor(private route: ActivatedRoute, public router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.attemptId = this.route.snapshot.paramMap.get('attemptId');

    if (!this.attemptId) {
      this.error = 'ID da tentativa não encontrado';
      this.isLoading = false;
      return;
    }

    const state = window.history.state;

    if (state && state.results && state.practiceExamId) {
      this.results = state.results;
      this.practiceExamId = state.practiceExamId;
      if (this.results != null) this.passed = this.results.passed;
      this.calculatePercentages();
      this.isLoading = false;
    } else {
      this.error = 'An error ocurred. Please try again later.';
      this.isLoading = false;
    }
  }

  calculatePercentages(): void {
    if (!this.results) return;
    const totalAnswered = this.results.correctAnswers + this.results.incorrectAnswers;
    if (totalAnswered === 0) return;
    this.correctPercentage = Math.round((this.results.correctAnswers / this.results.answers) * 100);
    this.incorrectPercentage = Math.round(
      (this.results.incorrectAnswers / this.results.answers) * 100
    );
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins} minutes`;
  }

  formatDateTime(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  showQuestions(filter: 'all' | 'correct' | 'incorrect'): void {
    this.showAllQuestions = filter === 'all';
    this.showCorrectAnswers = filter === 'correct';
    this.showIncorrectAnswers = filter === 'incorrect';
    this.currentPage = 1;
  }

  getQuestionTypeLabel = getQuestionTypeLabel;
}
