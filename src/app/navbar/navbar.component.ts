import { Component, OnInit } from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import { ApplicationSettingsService } from '../components/application-settings/application-settings.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class NavbarComponent implements OnInit {
  settings$: Observable<any>;
  isHomeEnabled = false;
  constructor(private appSettingsService: ApplicationSettingsService, protected router: Router) {
    this.settings$ = this.appSettingsService.settings$;
  }

  ngOnInit(): void {
    // Settings are auto-loaded from ApplicationSettingsService

  }
}
