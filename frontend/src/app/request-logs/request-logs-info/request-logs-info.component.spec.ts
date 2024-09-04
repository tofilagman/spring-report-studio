import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestLogsInfoComponent } from './request-logs-info.component';

describe('RequestLogsInfoComponent', () => {
  let component: RequestLogsInfoComponent;
  let fixture: ComponentFixture<RequestLogsInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestLogsInfoComponent]
    });
    fixture = TestBed.createComponent(RequestLogsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
