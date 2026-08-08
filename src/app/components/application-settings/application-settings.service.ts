import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface ApplicationSettings {
  id?: number;
  appTitle?: string;
  appIconPath?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoPath?: string;
  appDescription?: string;
  principalName?: string;
  schoolName?: string;
  establishedYear?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationSettingsService {

  private apiUrl = 'http://localhost:8080/maktab/api/settings/';
  private settingsSubject = new BehaviorSubject<ApplicationSettings | null>(null);
  public settings$ = this.settingsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadApplicationSettings();
  }

  /**
   * Load application settings from the backend
   */
  loadApplicationSettings(): void {
    this.getApplicationSettings().subscribe(
      (settings) => {
        this.settingsSubject.next(settings);
      },
      (error) => {
        console.error('Error loading application settings:', error);
      }
    );
  }

  /**
   * Get the current settings synchronously
   */
  getSettings(): ApplicationSettings | null {
    return this.settingsSubject.value;
  }

  /**
   * Get application settings from backend (main settings)
   */
  getApplicationSettings(): Observable<ApplicationSettings> {
    return this.http.get<ApplicationSettings>(this.apiUrl + 'app-settings')
      .pipe(
        tap((settings) => {
          this.settingsSubject.next(settings);
        })
      );
  }

  /**
   * Get application settings by ID
   */
  getApplicationSettingsById(id: number): Observable<ApplicationSettings> {
    return this.http.get<ApplicationSettings>(this.apiUrl + id);
  }

  /**
   * Save new application settings
   */
  saveApplicationSettings(settings: ApplicationSettings): Observable<ApplicationSettings> {
    return this.http.post<ApplicationSettings>(this.apiUrl, settings)
      .pipe(
        tap((saved) => {
          this.settingsSubject.next(saved);
        })
      );
  }

  /**
   * Update application settings
   */
  updateApplicationSettings(id: number, settings: ApplicationSettings): Observable<ApplicationSettings> {
    return this.http.put<ApplicationSettings>(this.apiUrl + id, settings)
      .pipe(
        tap((updated) => {
          this.settingsSubject.next(updated);
        })
      );
  }

  /**
   * Delete application settings
   */
  deleteApplicationSettings(id: number): Observable<any> {
    return this.http.delete(this.apiUrl + id);
  }
}

