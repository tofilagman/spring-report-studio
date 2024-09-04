import { Pipe, PipeTransform } from '@angular/core';
import { UtilService } from "../../services/util.service";

@Pipe({
  name: 'xdate'
})
export class XDatePipe implements PipeTransform {

  constructor(private util: UtilService) {
  }

  transform(value: any | null): string {
    return this.util.formatDate(value);
  }

}
