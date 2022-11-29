import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderModulesComponent } from './header-modules.component';

describe('HeaderModulesComponent', () => {
  let component: HeaderModulesComponent;
  let fixture: ComponentFixture<HeaderModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderModulesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
