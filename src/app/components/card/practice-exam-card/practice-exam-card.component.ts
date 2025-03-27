import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  UbCardDirective,
  UbCardHeaderDirective,
  UbCardTitleDirective,
  UbCardDescriptionDirective,
  UbCardContentDirective,
  UbCardFooterDirective,
} from '@/components/ui/card';
import { PracticeExam } from '../../../model/nahero.type';
import { formatTimeLimit, getDifficultyLabel } from '../../../../lib/utils';

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
  ],
  templateUrl: './practice-exam-card.component.html',
  styleUrl: './practice-exam-card.component.scss',
})
export class PracticeExamCardComponent {
  @Input() practiceExam!: PracticeExam;

  getDifficultyLabel = getDifficultyLabel;
  formatTimeLimit = formatTimeLimit;
  constructor(public router: Router) {}
}
