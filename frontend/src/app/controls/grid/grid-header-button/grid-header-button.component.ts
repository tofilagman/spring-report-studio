import { Component, OnInit } from '@angular/core';
import { IHeaderAngularComp } from "ag-grid-angular";
import { IHeaderParams } from "ag-grid-community";

@Component({
  selector: 'app-grid-header-button',
  templateUrl: './grid-header-button.component.html',
  styleUrls: ['./grid-header-button.component.scss']
})
export class GridHeaderButtonComponent implements IHeaderAngularComp {

  public params!: IHeaderParams | any;

  constructor() { }


  agInit(params: IHeaderParams): void {
    this.params = params;
  }

  refresh(params: IHeaderParams): boolean {
    this.params = params;
    return true;
  }

  btnClickedHandler(data: any) {
    this.params.clicked();
  }

}
