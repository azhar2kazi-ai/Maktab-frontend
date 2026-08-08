import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DashboardComponent {
  constructor(private router: Router) {}
  isHomeEnabled = false;
  navigateTo(section: string) {
    switch(section) {
      case 'students': this.router.navigate(['/students']); break;
      case 'teachers': this.router.navigate(['/teachers']); break;
      case 'fees': this.router.navigate(['/fees']); break;
      case 'reports': this.router.navigate(['/reports']); break;
      case 'exams': this.router.navigate(['/exams']); break;
      case 'subjects': this.router.navigate(['/subjects']); break;
      case 'classes': this.router.navigate(['/classes']); break;
      case 'attendance': this.router.navigate(['/attendance']); break;
      case 'evaluations': this.router.navigate(['/evaluations']); break;
      case 'upload': this.router.navigate(['/upload']); break;
    }
  }
}
