import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInitComponent } from './check-init.component';

describe('CheckInitComponent', () => {
  let component: CheckInitComponent;
  let fixture: ComponentFixture<CheckInitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckInitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckInitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
