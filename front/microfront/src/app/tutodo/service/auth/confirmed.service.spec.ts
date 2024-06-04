import { TestBed } from '@angular/core/testing';

import { ConfirmedService } from './confirmed.service';

describe('ConfirmedService', () => {
  let service: ConfirmedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
