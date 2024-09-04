import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: 'app-grid-button',
  templateUrl: './grid-button.component.html',
  styleUrls: ['./grid-button.component.scss']
})
export class GridButtonComponent implements ICellRendererAngularComp {
  public params!: ICellRendererParams | any;

  constructor() { }


  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    return true;
  }

  btnClickedHandler(btn: any) {
    btn.clicked(this.params.value, this.params.data, this.params.index, this.params.node);
  }

  isVisible(btn: any) {
    if(btn.activateIf === null || btn.activateIf === undefined)
      return true;
    return btn.activateIf(this.params.value, this.params.data);
  }
}
