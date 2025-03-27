import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UbInputDirective } from '@/components/ui/input';
import { UbButtonDirective } from '@/components/ui/button';
import { PracticeExamService } from '../../../service/practice-exam/practice-exam.service';
import { PracticeExamCardComponent } from '../../../components/card/practice-exam-card/practice-exam-card.component';
import { PracticeExam } from '../../../model/nahero.type';
import { getDifficultyLabel } from '../../../../lib/utils';

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
    UbInputDirective,
    UbButtonDirective,
    RouterModule,
    PracticeExamCardComponent,
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
  loading: boolean = false;
  allLoaded: boolean = false;
  showFilterModal: boolean = false;

  tempFilters: FilterOptions = {
    isActive: true,
  };

  getDifficultyLabel = getDifficultyLabel;

  constructor(private practiceExamService: PracticeExamService, public router: Router) {}

  ngOnInit() {
    this.tempFilters = { ...this.filters };
    this.loadPracticeExams();
  }

  async loadPracticeExams(append: boolean = false) {
    if (this.loading || (this.allLoaded && append)) return;

    this.loading = true;
    try {
      const result = await this.practiceExamService.getPaginatedPracticeExams(
        this.pageOptions,
        this.buildFilters()
      );

      if (append) {
        this.practiceExams = [...this.practiceExams, ...result.content];
      } else {
        this.practiceExams = result.content;
      }

      this.totalItems = result.totalElements;
      this.totalPages = result.totalPages;

      this.allLoaded = this.pageOptions.page >= this.totalPages - 1 || result.content.length === 0;
    } catch (error) {
      console.error('Error loading practice exams:', error);
    } finally {
      this.loading = false;
    }
  }

  buildFilters(): any {
    const predicates: any = {};
    if (this.searchQuery) {
      predicates['title'] = this.searchQuery;
    }
    if (this.filters.difficultyLevel !== undefined) {
      predicates['difficultyLevel'] = this.filters.difficultyLevel;
    }
    if (this.filters.isActive !== undefined) {
      predicates['isActive'] = this.filters.isActive;
    }
    return predicates;
  }

  onSearch() {
    this.pageOptions.page = 0;
    this.allLoaded = false;
    this.loadPracticeExams();
  }

  loadMore() {
    if (!this.loading && !this.allLoaded) {
      this.pageOptions.page += 1;
      this.loadPracticeExams(true);
    }
  }

  toggleFilterModal() {
    this.showFilterModal = !this.showFilterModal;
    if (this.showFilterModal) {
      this.tempFilters = { ...this.filters };
    }
  }

  closeFilterModal(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.showFilterModal = false;
    }
  }

  setDifficultyFilter(level: number | undefined) {
    this.tempFilters.difficultyLevel = level;
  }

  applyFilters() {
    this.filters = { ...this.tempFilters };
    this.showFilterModal = false;
    this.pageOptions.page = 0;
    this.allLoaded = false;
    this.loadPracticeExams();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (this.loading || this.allLoaded) return;

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    const scrollPercentage = (scrollTop + windowHeight) / documentHeight;
    if (scrollPercentage > 0.8) {
      this.loadMore();
    }
  }
}
