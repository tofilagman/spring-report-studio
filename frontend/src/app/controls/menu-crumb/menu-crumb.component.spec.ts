import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCrumbComponent } from './menu-crumb.component';

describe('MenuCrumbComponent', () => {
  let component: MenuCrumbComponent;
  let fixture: ComponentFixture<MenuCrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuCrumbComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuCrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
