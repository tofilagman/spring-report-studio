import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { UtilService } from 'src/app/services/util.service';
import { buttonAction, destroyLookUp } from 'src/app/stores/dataset/dataset.action';
import { selectDataLookUp } from 'src/app/stores/dataset/dataset.select';

@Component({
  selector: 'app-request-logs-info',
  templateUrl: './request-logs-info.component.html',
  styleUrls: ['./request-logs-info.component.scss']
})
export class RequestLogsInfoComponent implements OnInit, OnDestroy {

  @Input() id: number = 0;

  public data: any = {
    endpoint: null
  }
  
  editorOptions = { theme: 'vs-dark', language: 'bash', automaticLayout: true };

  constructor(public activeModal: NgbActiveModal, private store: Store, private util: UtilService) {
  }

  ngOnInit(): void {
    this.store.select(selectDataLookUp('logs-info'))
      .subscribe((x) => {
        if (this.util.isObject(x))
          this.data = x;
      });

    this.store.dispatch(buttonAction({
      name: 'logs-info',
      dataSource: "request-log/loadInfo",
      method: 'post',
      data: {
        id: this.id
      },
      notifyChanged: true
    }));

  }

  onSubmit() {

  }

  ngOnDestroy() {
    this.store.dispatch(destroyLookUp({ name: 'logs-info' }));
  }

  onFormEnter() {
    return false;
  }


}
