import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { combineLatestWith } from 'rxjs';
import { UtilService } from 'src/app/services/util.service';
import { buttonAction } from 'src/app/stores/dataset/dataset.action';
import { selectDataLookUp } from 'src/app/stores/dataset/dataset.select';

@Component({
  selector: 'app-endpoints-info',
  templateUrl: './endpoints-info.component.html',
  styleUrls: ['./endpoints-info.component.scss']
})
export class EndpointsInfoComponent implements OnInit, OnDestroy {

  @Input() id: number = 0;

  public hasChanges: boolean = false;
  renderTypes = RenderTypes;
  templates = [];

  public data: any = {
    id: 0,
    renderType: 1,
    isActive: true
  }

  constructor(public activeModal: NgbActiveModal, private store: Store, private util: UtilService) {
  }

  ngOnInit(): void {
    this.store.select(selectDataLookUp('endpoint-info'))
      .pipe(
        combineLatestWith(
          this.store.select(selectDataLookUp('templates'))
        ))
      .subscribe(([x, y]) => {
        if (this.util.isObject(x))
          this.data = { ...(x || { id: 0, renderType: 1, isActive: true }) };
        this.templates = y;
      });

    this.store.dispatch(buttonAction({
      name: 'templates',
      dataSource: "template/lookup",
      method: 'get',
      data: {},
      notifyChanged: false
    }));

    if (this.id > 0)
      this.store.dispatch(buttonAction({
        name: 'endpoint-info',
        dataSource: "endpoint/loadInfo",
        method: 'post',
        data: {
          id: this.id
        },
        notifyChanged: true
      }));
    else
      this.data = { id: 0, renderType: 1, isActive: true };
  }

  onSubmit() {
    this.hasChanges = true;
    this.store.dispatch(buttonAction({
      name: "endpoint-info",
      dataSource: "endpoint/saveInfo",
      data: {
        ...this.data,
      },
      method: "post",
      notifyChanged: true
    }));
  }

  ngOnDestroy() {
    this.hasChanges = false;
    this.data = {};
  }

  onFormEnter() {
    return false;
  }

  expiresInDateChanged(value: any) {
    this.data = {
      ...this.data,
      expiresIn: value,
    }
  }
}

export const RenderTypes = [
  { id: 1, name: "Base64Stream" },
  { id: 2, name: "Window" }
];

