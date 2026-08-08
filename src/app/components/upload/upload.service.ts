import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import {API_BASE} from "../_api-base";
import {ManualData} from "../models/all.models";

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private baseUrl = `${API_BASE}`+`/student`;

  constructor(private http: HttpClient) {}

  uploadExcel(file: File): Observable<ManualData[]> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post<ManualData[]>(`${this.baseUrl}/uploadExcel`, formData);
  }
}
