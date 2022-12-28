import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectingDataComponent } from './collecting-data.component';

describe('CollectingDataComponent', () => {
  let component: CollectingDataComponent;
  let fixture: ComponentFixture<CollectingDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectingDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
