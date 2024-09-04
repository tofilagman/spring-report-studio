import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestLogsErrorInfoComponent } from './request-logs-error-info.component';

describe('RequestLogsErrorInfoComponent', () => {
  let component: RequestLogsErrorInfoComponent;
  let fixture: ComponentFixture<RequestLogsErrorInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestLogsErrorInfoComponent]
    });
    fixture = TestBed.createComponent(RequestLogsErrorInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
