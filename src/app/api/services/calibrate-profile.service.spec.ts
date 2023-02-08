import { TestBed } from '@angular/core/testing';

import { CalibrateProfileService } from './calibrate-profile.service';

describe('CalibrateProfileService', () => {
  let service: CalibrateProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalibrateProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
