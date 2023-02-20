import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartPreProcessingComponent } from './start-pre-processing.component';

describe('StartPreProcessingComponent', () => {
  let component: StartPreProcessingComponent;
  let fixture: ComponentFixture<StartPreProcessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartPreProcessingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartPreProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
