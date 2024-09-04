import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from 'src/app/services/util.service';
import { DataDateAdapter, DataDateParserFormatter } from '../date-picker/date-picker.service';

@Component({
  selector: '[date-range-picker]',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: DataDateAdapter },
    { provide: NgbDateParserFormatter, useClass: DataDateParserFormatter }
  ]
})
export class DateRangePickerComponent implements OnInit {

  public name: string | null = null;
  public required: boolean = false;

  @Input() set fromDate(value: string | null) { 
    if (value === null) {
      this.fromValue = null;
      return;
    }
    const nval =  this.util.formatDate(value);
    const parsed = this.formatter.parse(nval);
    this.fromValue = parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : null;
  }

  @Input() set toDate(value: string | null) {
    if (value === null) { 
      this.toValue = null;
      return;
    }
    const nval =  this.util.formatDate(value);
    const parsed = this.formatter.parse(nval);
    this.toValue = parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : null;
  }

  @Input() set fieldRequired(value: string) {
    this.required = value.toLocaleLowerCase() === 'true'
  }

  @Output() fromDateChange = new EventEmitter<string | null>();
  @Output() toDateChange = new EventEmitter<string | null>();

  hoveredDate: NgbDate | null = null;

  fromValue: NgbDate | null = null;
  toValue: NgbDate | null = null;

  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter, private util: UtilService) {
    // this.fromValueChange(this.calendar.getToday());
    // this.toValueChange(this.calendar.getNext(this.calendar.getToday(), 'd', 5));
  }

  onDateSelection(date: NgbDate) { 
    if (!this.fromValue && !this.toValue) {
      this.fromValueChange(date); 
    } else if (this.fromValue && !this.toValue && date && date.after(this.fromValue)) {
      this.toValueChange(date);
    } else {
      this.toValueChange(null);
      this.fromValueChange(date);
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromValue && !this.toValue && this.hoveredDate && date.after(this.fromValue) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toValue && date.after(this.fromValue) && date.before(this.toValue);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromValue) ||
      (this.toValue && date.equals(this.toValue)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateFromInput(currentValue: NgbDate | null, input: string) {
    const parsed = this.formatter.parse(input);
    this.fromValueChange(parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue);
  }

  validateToInput(currentValue: NgbDate | null, input: string) {
    const parsed = this.formatter.parse(input);
    this.toValueChange(parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue);
  }

  ngOnInit(): void {

  }

  fromValueChange(currentValue: NgbDate | null) {
    this.fromValue = currentValue;
    const ntc = this.formatter.format(currentValue);
    var nVal = this.util.toJsonDate(ntc);
    this.fromDateChange.emit(nVal);
  }

  toValueChange(currentValue: NgbDate | null) {
    this.toValue = currentValue;
    const ntc = this.formatter.format(currentValue);
    var nVal = this.util.toJsonDate(ntc);
    this.toDateChange.emit(nVal);
  }

}
