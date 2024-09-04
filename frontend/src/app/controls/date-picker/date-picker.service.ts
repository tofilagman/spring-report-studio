import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from "../../services/util.service";

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class DataDateAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '/';

  constructor(private util: UtilService) {
    super();
  }

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      var date = this.util.regex(/\d+/gm, value);
      return {
        day: parseInt(date[1], 10),
        month: parseInt(date[0], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.month + this.DELIMITER + date.day + this.DELIMITER + date.year : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class DataDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  constructor(private util: UtilService) {
    super();
  }

  parse(value: string): NgbDateStruct | null {
    if (value) {
      var date = this.util.regex(/\d+/gm, value);
      return {
        day: parseInt(date[1], 10),
        month: parseInt(date[0], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.month + this.DELIMITER + date.day + this.DELIMITER +  date.year : '';
  }

}

/*
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will want to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class NgbdDatepickerAdapter {

  model1: string;
  model2: string;

  constructor(private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>) {}

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
}
 */
