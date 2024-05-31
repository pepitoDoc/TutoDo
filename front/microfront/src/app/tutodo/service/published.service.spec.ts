import { TestBed } from '@angular/core/testing';

import { PublishedService } from './published.service';

describe('PublishedService', () => {
  let service: PublishedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublishedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
