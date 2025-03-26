import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  UbCardDirective,
  UbCardHeaderDirective,
  UbCardTitleDirective,
  UbCardDescriptionDirective,
  UbCardContentDirective,
  UbCardFooterDirective,
} from '@/components/ui/card';
import { UbInputDirective } from '@/components/ui/input';
import { UbButtonDirective } from '@/components/ui/button';
import { PracticeExamService } from '../../../service/practice-exam/practice-exam.service';

interface User {
  id: string | number;
  name: string;
}

interface Exam {
  id: string;
  title: string;
  description?: string;
}

interface PracticeExam {
  id: string;
  exam: Exam;
  title: string;
  description?: string;
  passingScore?: number;
  teacher: User;
  timeLimit?: number;
  difficultyLevel?: number;
  isActive: boolean;
  createdAt: Date;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

interface PaginationOptions {
  page: number;
  size: number;
  sort?: string;
}

interface FilterOptions {
  title?: string;
  examTitle?: string;
  description?: string;
  difficultyLevel?: number;
  isActive?: boolean;
}

@Component({
  selector: 'app-practice-exams',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UbCardDirective,
    UbCardHeaderDirective,
    UbCardTitleDirective,
    UbCardDescriptionDirective,
    UbCardContentDirective,
    UbCardFooterDirective,
    UbInputDirective,
    UbButtonDirective,
    RouterModule,
  ],
  templateUrl: './practice-exams.component.html',
  styleUrl: './practice-exams.component.scss',
})
export class PracticeExamsPage implements OnInit {
  searchQuery: string = '';
  practiceExams: PracticeExam[] = [];
  totalItems: number = 0;
  totalPages: number = 0;

  pageOptions: PaginationOptions = {
    page: 0,
    size: 6,
    sort: 'createdAt,desc',
  };

  filters: FilterOptions = {
    isActive: true,
  };

  difficultyOptions = [
    { value: undefined, label: 'All Difficulty Levels' },
    { value: 1, label: 'Beginner' },
    { value: 2, label: 'Intermediate' },
    { value: 3, label: 'Advanced' },
    { value: 4, label: 'Expert' },
  ];

  constructor(private practiceExamService: PracticeExamService, public router: Router) {}

  ngOnInit() {
    this.loadPracticeExams();
  }

  async loadPracticeExams() {
    try {
      const result = await this.practiceExamService.getPaginatedPracticeExams(
        this.pageOptions,
        this.buildFilters()
      );

      this.practiceExams = result.content;
      this.totalItems = result.totalElements;
      this.totalPages = result.totalPages;
    } catch (error) {
      console.error('Error loading practice exams:', error);
    }
  }

  buildFilters(): any {
    const predicates: any = {};

    if (this.searchQuery) {
      predicates['title'] = this.searchQuery;
      predicates['description'] = this.searchQuery;
      predicates['exam.title'] = this.searchQuery;
    }

    if (this.filters.difficultyLevel !== undefined) {
      predicates['difficultyLevel'] = this.filters.difficultyLevel;
    }

    if (this.filters.isActive !== undefined) {
      predicates['isActive'] = this.filters.isActive;
    }

    return predicates;
  }

  getDifficultyLabel(level: number): string {
    switch (level) {
      case 1:
        return 'Beginner';
      case 2:
        return 'Intermediate';
      case 3:
        return 'Advanced';
      case 4:
        return 'Expert';
      default:
        return 'Unknown';
    }
  }

  formatTimeLimit(minutes?: number): string {
    if (!minutes) return 'No time limit';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes} minutes`;
  }

  onSearch() {
    this.pageOptions.page = 0;
    this.loadPracticeExams();
  }

  onFilterChange() {
    this.pageOptions.page = 0;
    this.loadPracticeExams();
  }

  changePage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.pageOptions.page = page;
      this.loadPracticeExams();
    }
  }

  nextPage() {
    this.changePage(this.pageOptions.page + 1);
  }

  prevPage() {
    this.changePage(this.pageOptions.page - 1);
  }
}
