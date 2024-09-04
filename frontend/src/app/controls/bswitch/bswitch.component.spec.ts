import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BSwitchComponent } from './bswitch.component';

describe('BSwitchComponent', () => {
  let component: BSwitchComponent;
  let fixture: ComponentFixture<BSwitchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BSwitchComponent]
    });
    fixture = TestBed.createComponent(BSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
