import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UtilService } from "../../services/util.service";
import { NgbDateAdapter, NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
import { DataDateAdapter, DataDateParserFormatter } from "./date-picker.service";
import { isBoolean } from "@ngrx/store/src/meta-reducers/utils";

/*
*  <div class="input-group" date-picker [(fieldValue)]="fieldValue">
* */

@Component({
  selector: '[date-picker]',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: DataDateAdapter },
    { provide: NgbDateParserFormatter, useClass: DataDateParserFormatter }
  ]
})
export class DatePickerComponent implements OnInit {

  public value: string | null = null;
  public required: boolean = false;
  public readonly: boolean = false;
  public name: string | null = null;


  @Input() set fieldValue(value: string | null) {
    this.value = this.util.formatDate(value);
  }

  @Input() set fieldRequired(value: string) {
    this.required = value.toLocaleLowerCase() === 'true'
  }

  @Input() set fieldReadOnly(value: string) {
    this.readonly = value.toLocaleLowerCase() === 'true'
  }

  @Output() fieldValueChange = new EventEmitter<string | null>();

  constructor(private util: UtilService) {
  }

  ngOnInit() {
  }

  valueChange(value: string | null) {
    var nVal = this.util.toJsonDate(value);
    this.fieldValueChange.emit(nVal);
  }

}
