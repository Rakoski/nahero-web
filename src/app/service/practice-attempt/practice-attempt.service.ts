import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../../constants';

@Injectable({
  providedIn: 'root',
})
export class PracticeAttemptService {
  private apiUrl = `${API_URL}student-practice-attempts`;

  constructor(private http: HttpClient) {}

  createAttempt(practiceExamId: string): Observable<number> {
    return this.http.post<number>(this.apiUrl, {
      practiceExamId: practiceExamId,
    });
  }
}
