import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_URL, size } from '../../../constants';
import { PracticeExam } from '../../model/nahero.type';

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

@Injectable({
  providedIn: 'root',
})
export class PracticeExamService {
  private apiUrl = API_URL + 'practice-exams';

  constructor(private http: HttpClient) {}

  async getPracticeExams(): Promise<PracticeExam[]> {
    return firstValueFrom(this.http.get<PracticeExam[]>(`${this.apiUrl}`));
  }

  async getPaginatedPracticeExams(
    paginationOptions: PaginationOptions,
    filters?: any
  ): Promise<PageResponse<PracticeExam>> {
    let params = new HttpParams().set('page', paginationOptions.page.toString()).set('size', size);

    if (paginationOptions.sort) {
      params = params.set('sort', paginationOptions.sort);
    }

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return firstValueFrom(
      this.http.get<PageResponse<PracticeExam>>(`${this.apiUrl}/list`, { params })
    );
  }

  async getPracticeExamById(id: string): Promise<PracticeExam> {
    return firstValueFrom(this.http.get<PracticeExam>(`${this.apiUrl}/${id}`));
  }
}
