import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AllMelodlePaths } from '../app.routes';

@Injectable({
  providedIn: 'root'
})
export class SafeRoutingService {
  readonly router = inject(Router);

  // TODO
  public navigate<TRoute extends AllMelodlePaths>(paths: TRoute[]) {
      this.router.navigate(paths);
  }

  public createLink<TRoute extends AllMelodlePaths>(path: TRoute) {
      return path;
  }
}
