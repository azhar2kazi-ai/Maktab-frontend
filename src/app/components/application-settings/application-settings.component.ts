import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationSettingsService, ApplicationSettings } from './application-settings.service';

@Component({
  selector: 'app-application-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './application-settings.component.html',
  styleUrls: ['./application-settings.component.css']
})
export class ApplicationSettingsComponent implements OnInit {

  settings: ApplicationSettings = {};
  loading = false;
  submitted = false;
  message = '';
  messageType = ''; // 'success' or 'error'

  constructor(private appSettingsService: ApplicationSettingsService) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.loading = true;
    this.appSettingsService.getApplicationSettings().subscribe({
      next: (data) => {
        this.settings = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading settings:', error);
        this.loading = false;
        this.showMessage('Error loading settings', 'error');
      }
    });
  }

  saveSettings(): void {
    this.submitted = true;
    this.loading = true;

    if (this.settings.id) {
      // Update existing
      this.appSettingsService.updateApplicationSettings(this.settings.id, this.settings).subscribe({
        next: (data) => {
          this.settings = data;
          this.loading = false;
          this.showMessage('Settings updated successfully', 'success');
        },
        error: (error) => {
          console.error('Error updating settings:', error);
          this.loading = false;
          this.showMessage('Error updating settings', 'error');
        }
      });
    } else {
      // Save new
      this.appSettingsService.saveApplicationSettings(this.settings).subscribe({
        next: (data) => {
          this.settings = data;
          this.loading = false;
          this.showMessage('Settings saved successfully', 'success');
        },
        error: (error) => {
          console.error('Error saving settings:', error);
          this.loading = false;
          this.showMessage('Error saving settings', 'error');
        }
      });
    }
  }

  resetForm(): void {
    this.submitted = false;
    this.loadSettings();
  }

  private showMessage(text: string, type: string): void {
    this.message = text;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}

