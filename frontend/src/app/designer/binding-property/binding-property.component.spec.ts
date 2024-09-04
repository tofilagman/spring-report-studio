import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BindingPropertyComponent } from './binding-property.component';

describe('BindingPropertyComponent', () => {
  let component: BindingPropertyComponent;
  let fixture: ComponentFixture<BindingPropertyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BindingPropertyComponent]
    });
    fixture = TestBed.createComponent(BindingPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
