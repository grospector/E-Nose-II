import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndPreProcessingComponent } from './end-pre-processing.component';

describe('EndPreProcessingComponent', () => {
  let component: EndPreProcessingComponent;
  let fixture: ComponentFixture<EndPreProcessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndPreProcessingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EndPreProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
