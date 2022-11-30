import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestReportComponent } from './test-report.component';

describe('TestReportComponent', () => {
  let component: TestReportComponent;
  let fixture: ComponentFixture<TestReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
