import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store'; 
import { selectDataLookUp } from '../stores/dataset/dataset.select';
import { buttonAction, destroyAllLookUp } from '../stores/dataset/dataset.action';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  constructor(private store: Store) {
  }

  data: any = {
    domain: null,
    endpoints: 0,
    logs: 0,
    templates: 0
  }

  ngOnInit(): void { 
    this.store.select(selectDataLookUp('dash-counter'))
      .subscribe((x: any) => {
        if (x != null && Array.isArray(x))
          return;
        this.data = x;
      });

    this.store.dispatch(buttonAction({
      name: 'dash-counter',
      dataSource: "dashboard/loadCounter",
      method: 'post',
      data: {},
      notifyChanged: true
    }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(destroyAllLookUp());
  }

}
