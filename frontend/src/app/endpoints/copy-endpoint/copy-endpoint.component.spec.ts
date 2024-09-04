import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyEndpointComponent } from './copy-endpoint.component';

describe('CopyEndpointComponent', () => {
  let component: CopyEndpointComponent;
  let fixture: ComponentFixture<CopyEndpointComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CopyEndpointComponent]
    });
    fixture = TestBed.createComponent(CopyEndpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
