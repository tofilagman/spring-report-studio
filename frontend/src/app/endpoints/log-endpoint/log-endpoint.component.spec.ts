import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogEndpointComponent } from './log-endpoint.component';

describe('LogEndpointComponent', () => {
  let component: LogEndpointComponent;
  let fixture: ComponentFixture<LogEndpointComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogEndpointComponent]
    });
    fixture = TestBed.createComponent(LogEndpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
