import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponse } from '../models/page-response.model';
import { PageRequest } from '../models/page-request.model';

@Injectable({ providedIn: 'root' })
export class PaginatorService {
  constructor(private http: HttpClient) {}

  /**
   * Fetch a page from the backend.
   * url: API endpoint (e.g. '/api/students')
   * req: page, size, sort (repeatable)
   */
  fetchPage<T>(url: string, req: PageRequest = {}): Observable<PageResponse<T>> {
    let params = new HttpParams()
      .set('page', String(req.page ?? 0))
      .set('size', String(req.size ?? 20));

    if (req.sort && req.sort.length) {
      // HttpParams is immutable; append each sort value
      req.sort.forEach(s => {
        params = params.append('sort', s);
      });
    }

    return this.http.get<PageResponse<T>>(url, { params });
  }
}