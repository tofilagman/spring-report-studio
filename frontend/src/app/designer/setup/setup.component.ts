import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { buttonAction, loadDataInfo, saveDataInfo } from 'src/app/stores/dataset/dataset.action';
import { selectDataInfo, selectDataLookUp } from 'src/app/stores/dataset/dataset.select';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit, OnDestroy {

  @Input() id: number = 0;

  public hasChanges: boolean = false;
  orientationTypes = OrientationTypes;
  documentTypes = DocumentTypes;

  public data: any = {
    id: 0,
    orientation: 1,
    documentType: 4
  }

  constructor(public activeModal: NgbActiveModal, private store: Store) {
  }

  ngOnInit(): void {
    this.store.select(selectDataLookUp('setup-info')).subscribe((x: any) => {
      if (x === null) return;

      this.data = { ...(x || { id: 0, orientation: 1, documentType: 4 }) };

      if (this.hasChanges)
        this.activeModal.close(x);
    });

    if (this.id > 0)
      this.store.dispatch(buttonAction({
        name: 'setup-info',
        dataSource: "template/loadInfo",
        method: 'post',
        data: {
          id: this.id
        },
        notifyChanged: true
      }));
    else
      this.data = {};
  }

  onSubmit() {
    this.hasChanges = true;
    this.store.dispatch(buttonAction({
      dataSource: "template/saveInfo",
      data: {
        ...this.data,
      },
      name: "setup-info",
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
}

export const OrientationTypes = [
  { id: 1, name: "Portrait" },
  { id: 0, name: "Landscape" }
];

export const DocumentTypes = [
  { id: 0, name: "A0" },
  { id: 1, name: "A1" },
  { id: 2, name: "A2" },
  { id: 3, name: "A3" },
  { id: 4, name: "A4" },
  { id: 5, name: "A5" },
  { id: 6, name: "A6" },
  { id: 28, name: "Letter" },
  { id: 27, name: "Legal" },
  { id: 29, name: "Tabloid" },
  { id: 26, name: "Ledger" }
];
