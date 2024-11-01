import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppNavbarComponent } from '../components/app-navbar/app-navbar.component';
import { SelfService } from '../services/self.service';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [RouterOutlet, AppNavbarComponent, JsonPipe, AsyncPipe],
  templateUrl: './app-layout.page.html',
})
export class AppLayoutPage {
    self = inject(SelfService);

    userInfo = this.self.getUserInfo();
}
