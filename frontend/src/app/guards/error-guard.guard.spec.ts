import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { errorGuardGuard } from './error.guard';

describe('errorGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => errorGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
