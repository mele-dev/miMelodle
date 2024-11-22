import { Component, inject } from '@angular/core';
import { HeroPageTranslator } from './hero.page.translations';
import { SafeRoutingService } from '../../services/safe-routing.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hero.page.html',
})
export class HeroPage {
  dict = inject(HeroPageTranslator).dict
  safeRouter = inject(SafeRoutingService);

} 
