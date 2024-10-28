import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppNavbarComponent } from '../components/app-navbar/app-navbar.component';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [RouterOutlet, AppNavbarComponent],
  templateUrl: './app-layout.page.html',
})
export class AppLayoutPage {

}
