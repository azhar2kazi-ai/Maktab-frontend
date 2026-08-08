import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SidebarComponent {

  constructor(private router: Router) { }

  // Optional: navigate programmatically
  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
