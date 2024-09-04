import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndpointsInfoComponent } from './endpoints-info.component';

describe('EndpointsInfoComponent', () => {
  let component: EndpointsInfoComponent;
  let fixture: ComponentFixture<EndpointsInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EndpointsInfoComponent]
    });
    fixture = TestBed.createComponent(EndpointsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
