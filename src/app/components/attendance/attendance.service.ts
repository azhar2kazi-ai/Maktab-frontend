// src/app/services/attendance.service.ts
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Attendance, Student} from '../models/all.models';
import {API_BASE} from '../_api-base';

@Injectable({providedIn: 'root'})
export class AttendanceService {
  private baseUrl = `${API_BASE}` + `/attendance/`;

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(this.baseUrl);
  }

  create(dto: Attendance): Observable<Attendance> {
    return this.http.post<Attendance>(this.baseUrl, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}`);
  }

  saveAttendance(request: object):
    Observable<Attendance> {
    return this.http.post<Attendance>(this.baseUrl + `saveAttendance`, request);
  }
  saveAttendances(request: object):
    Observable<Attendance> {
    return this.http.post<Attendance>(this.baseUrl + `saveAttendances`, request);
  }
  getMonthlyAttendance(studentIds: number[], year: number, month: number): Observable<Attendance[]> {
    const params = {"year": year,"month":month, studentIds: studentIds};
    return this.http.post<Attendance[]>(`${this.baseUrl}monthly`, params);
  }
  getAttendanceSummary(studentId: number, year: number, month: number): Observable<any> {
    const params = {"year": year,"month":month, studentId: studentId};
    return this.http.post(`${this.baseUrl}attendance-summary`, params);
  }
}
