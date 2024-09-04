import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPagingComponent } from './list-paging.component';

describe('ListPagingComponent', () => {
  let component: ListPagingComponent;
  let fixture: ComponentFixture<ListPagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPagingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
