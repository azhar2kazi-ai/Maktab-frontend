import {Component, OnInit} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {NavbarComponent} from './navbar/navbar.component';
import {CommonModule} from "@angular/common";
import {Title} from '@angular/platform-browser';
import {ApplicationSettingsService} from './components/application-settings/application-settings.service';
import {LoadingComponent} from "./shared/components/loading/loading.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    LoadingComponent
  ]
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private titleService: Title,
    private appSettingsService: ApplicationSettingsService
  ) {
  }

  ngOnInit() {
    // Load application settings from database
    this.appSettingsService.settings$.subscribe((settings) => {
      if (settings && settings.appTitle) {
        this.titleService.setTitle(settings.appTitle);
      } else {
        // Fallback to default title if settings are not loaded
        this.titleService.setTitle('Anjuman Hazrat ABu Bakr Siddique');
      }
    });
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

}
