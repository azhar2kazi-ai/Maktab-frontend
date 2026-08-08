import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule,FormsModule]
})
export class LoginComponent {
   username: string = '';
    password: string = '';

  constructor(private router: Router) {}

  onLogin() {
    // For now, simple check
    if (this.username === 'admin' && this.password === 'admin') {
      this.router.navigate(['/dashboard']);
    } else {
      alert('Invalid credentials');
    }
  }
}
