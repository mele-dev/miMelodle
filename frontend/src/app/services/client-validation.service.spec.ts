import { TestBed } from '@angular/core/testing';

import { ClientValidationService } from './client-validation.service';

describe('ClientValidationService', () => {
  let service: ClientValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
