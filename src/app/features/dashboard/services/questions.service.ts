import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Question } from '../models/questions';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { NewQuestion } from '../models/questions';
import { BaseDepartment } from '../models/department';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  private readonly apiUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) { }

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/questions`)
  }
  submitAnswers(answers: Record<string, any>): Observable<any> {
    const payload = {
      timestamp: new Date().toISOString(),
      answers
    };

    return this.http.post(`${this.apiUrl}/submissions`, payload);
  }
  addQuestion(question: any): Observable<NewQuestion> {
    return this.http.post<NewQuestion>(`${this.apiUrl}/add-questions`, question);
  }
  addepartment(department: BaseDepartment): Observable<BaseDepartment> {
    console.log("department", department)
    return this.http.post<BaseDepartment>(`${this.apiUrl}/add-department`, department)
  }
  getdepartment(): Observable<BaseDepartment[]> {
    return this.http.get<BaseDepartment[]>(`${this.apiUrl}/departments`)
  }
  deleteQuestion(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateQuestion(id: string, updated: Partial<Question>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updated);
  }
}
