import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterModulesComponent } from './footer-modules.component';

describe('FooterModulesComponent', () => {
  let component: FooterModulesComponent;
  let fixture: ComponentFixture<FooterModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterModulesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
