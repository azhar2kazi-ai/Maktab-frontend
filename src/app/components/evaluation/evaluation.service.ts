import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Evaluation, EvaluationDTO, StudentEvaluation} from '../models/all.models';
import {API_BASE} from '../_api-base';

@Injectable({providedIn: 'root'})
export class EvaluationService {
  private baseUrl = `${API_BASE}` + `/evaluation/`;

  constructor(private http: HttpClient) {
  }

  list(req: { page: number; size: number }): Observable<Evaluation[]> {
    return this.http.post<Evaluation[]>(this.baseUrl + `list`, req);
  }

  get(id: number): Observable<Evaluation> {
    return this.http.get<Evaluation>(`${this.baseUrl}${id}`);
  }

  create(dto: EvaluationDTO): Observable<Evaluation> {
    return this.http.post<Evaluation>(this.baseUrl, dto);
  }

  update(id: number, dto: Evaluation): Observable<Evaluation> {
    return this.http.put<Evaluation>(`${this.baseUrl}${id}/edit`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}/delete`);
  }

  linkEvaluationsToClass(classId: number, evaluationIds: number[]) {
    return this.http.post<string>(`${API_BASE}/evaluation-maktab-class/class/${classId}/link`, evaluationIds);
  }

  getEvaluationIdByClassId(selectedClassId: number) {
    return this.http.get<Set<number>>(`${this.baseUrl}${selectedClassId}/getEvaluationIdByClassId`);
  }

  // Get linked evaluations for a class from EvaluationMaktabClassController
  getLinkedEvaluationsForClass(classId: number): Observable<any[]> {
    return this.http.get<any[]>(`${API_BASE}/evaluation-maktab-class/class/${classId}`);
  }

  getEvaluationForm(studentId: number) {
    return this.http.get<StudentEvaluation>(`${API_BASE}/evaluation-maktab-class/form/${studentId}`);
  }

  submitEvaluationForm(dto: StudentEvaluation) {
    return this.http.post<string>(`${API_BASE}/evaluation-maktab-class/submit-evaluation`, dto);
  }
}
