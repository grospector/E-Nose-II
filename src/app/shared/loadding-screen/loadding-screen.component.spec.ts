import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaddingScreenComponent } from './loadding-screen.component';

describe('LoaddingScreenComponent', () => {
  let component: LoaddingScreenComponent;
  let fixture: ComponentFixture<LoaddingScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaddingScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaddingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
