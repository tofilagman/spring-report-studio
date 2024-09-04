import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridHeaderButtonComponent } from './grid-header-button.component';

describe('GridHeaderButtonComponent', () => {
  let component: GridHeaderButtonComponent;
  let fixture: ComponentFixture<GridHeaderButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridHeaderButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridHeaderButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
