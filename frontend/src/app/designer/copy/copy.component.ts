import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { buttonAction } from 'src/app/stores/dataset/dataset.action';
import { selectDataLookUp } from 'src/app/stores/dataset/dataset.select';

@Component({
  selector: 'app-copy',
  templateUrl: './copy.component.html',
  styleUrls: ['./copy.component.scss']
})
export class CopyComponent implements OnInit, OnDestroy {

  @Input() id: number = 0;

  public hasChanges: boolean = false; 

  public data: any = { 
    name: null
  }

  constructor(public activeModal: NgbActiveModal, private store: Store) {
  }

  ngOnInit(): void {
    this.store.select(selectDataLookUp('copy-info')).subscribe((x: any) => {
      if (x === null) return;  
      if (this.hasChanges)
        this.activeModal.close(x);
    });
  }

  onSubmit() {
    this.hasChanges = true;
    this.store.dispatch(buttonAction({
      dataSource: "template/copyInfo",
      data: {
        id: this.id,
        name: this.data.name
      },
      name: "copy-info",
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