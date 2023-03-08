import { TestBed } from '@angular/core/testing';

import { CurrentStateTestingService } from './current-state-testing.service';

describe('CurrentStateTestingService', () => {
  let service: CurrentStateTestingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentStateTestingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
