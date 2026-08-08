import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Student, Subject} from '../models/all.models';
import { API_BASE } from '../_api-base';

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private baseUrl = `${API_BASE}`+`/subject/`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<Subject[]> { return this.http.get<Subject[]>(this.baseUrl); }
  get(id: number): Observable<Subject> { return this.http.get<Subject>(`${this.baseUrl}/${id}`); }
  create(dto: Subject): Observable<Subject> { return this.http.post<Subject>(this.baseUrl, dto); }
  update(id: number, dto: Subject): Observable<Subject> { return this.http.put<Subject>(`${this.baseUrl}/${id}`, dto); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/${id}`); }

  getSubjectsByClass(classId: number) {
    return this.http.get<Subject[]>(`${this.baseUrl}${classId}/getSubjectsByClass`);
  }
}
