import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListPageEventArgs } from "../../stores/dataset/dataset.model";

@Component({
  selector: 'list-paging',
  templateUrl: './list-paging.component.html',
  styleUrls: ['./list-paging.component.scss']
})
export class ListPagingComponent {

  @Input() public skip = 1;
  @Input() public take = 30;
  @Input('count') set count(value: number) {
    if (value === 0) {
      this.recordStatus = 'No record';
    } else {
      let ntc = value > 1 ? 's' : '';
      this.recordStatus = `from ${value} record${ntc}`;
    }
    this.xcount = value;
    this.refreshItems();
  }

  @Output('page-changed') pageChanged = new EventEmitter<ListPageEventArgs>();

  public recordStatus: string = 'No record';
  public pageItems: Array<number> = [];
  private xcount = 0;

  public valueChanged() {
    this.refreshItems();
    this.pageChanged.emit({ skip: (this.skip || 1) - 1, take: this.take });
  }

  refreshItems() {
    this.pageItems = [];

    var pguBound = Math.ceil(this.xcount / this.take);
    this.pageItems = Array(pguBound).fill(0).map((_, i) => i + 1);
  }

}
