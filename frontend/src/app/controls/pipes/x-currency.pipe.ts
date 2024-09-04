import { Pipe, PipeTransform } from '@angular/core';
import { UtilService } from "../../services/util.service";

@Pipe({
  name: 'xcurrency'
})
export class XCurrencyPipe implements PipeTransform {

  constructor(private util: UtilService) {
  }

  transform(value: number | null): string {
    return this.util.currency(value) || '0.00';
  }

}
