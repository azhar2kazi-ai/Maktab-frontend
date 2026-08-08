import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../_api-base';

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private http: HttpClient) {}
  getTopStudents(): Observable<any[]> { return this.http.get<any[]>(`${API_BASE}`+`/reports/attendance/top5`); }
  getFeePerClass(): Observable<any[]> { return this.http.get<any[]>(`${API_BASE}`+`/reports/fees/per-class`); }
  getTeacherWorkload(): Observable<any[]> { return this.http.get<any[]>(`${API_BASE}`+`/reports/teachers/workload`); }
  getGuardiansWithPendingFees(): Observable<any[]> { return this.http.get<any[]>(`${API_BASE}`+`/reports/guardians/pending-fees`); }
  getAttendancePerSubject(): Observable<any[]> { return this.http.get<any[]>(`${API_BASE}`+`/reports/subjects/attendance`); }
  getAttendanceReport(searchParams: any) {
    return this.http.post(`${API_BASE}`+`/reports/attendance-report`, searchParams);
  }
}
