import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { UtilService } from 'src/app/services/util.service';
import { buttonAction } from 'src/app/stores/dataset/dataset.action';
import { selectDataLookUp } from 'src/app/stores/dataset/dataset.select';

@Component({
  selector: 'app-copy-endpoint',
  templateUrl: './copy-endpoint.component.html',
  styleUrls: ['./copy-endpoint.component.scss']
})
export class CopyEndpointComponent implements OnInit, OnDestroy {

  @Input() id: number = 0;

  editorOptions = { theme: 'vs-dark', language: 'bash', automaticLayout: true };
  data: string;

  constructor(public activeModal: NgbActiveModal, private store: Store, private util: UtilService) {
  }

  ngOnInit(): void {
    this.store.select(selectDataLookUp('endpoint-request'))
      .subscribe((x: any) => {
        if (x != null && Array.isArray(x))
          return;

        this.data = x; 
      });

    this.store.dispatch(buttonAction({
      name: 'endpoint-request',
      dataSource: "endpoint/loadRequestMap",
      method: 'post',
      data: {
        id: this.id
      },
      notifyChanged: true
    }));
  }

  onSubmit() {
    // this.hasChanges = true;
    // this.store.dispatch(buttonAction({
    //   name: "endpoint-info",
    //   dataSource: "endpoint/saveInfo",
    //   data: {
    //     ...this.data,
    //   },
    //   method: "post",
    //   notifyChanged: true
    // }));
  }

  ngOnDestroy() {
     this.data = null;
  }

  onFormEnter() {
    return false;
  }

}
