import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideBarModulesComponent } from './aside-bar-modules.component';

describe('AsideBarModulesComponent', () => {
  let component: AsideBarModulesComponent;
  let fixture: ComponentFixture<AsideBarModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsideBarModulesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsideBarModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
