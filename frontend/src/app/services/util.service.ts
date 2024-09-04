import { Injectable } from "@angular/core";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { ToastService, ToastType } from "./toast.service";
import * as moment from 'moment';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import { ConfirmationModalComponent } from '../controls/modals/confirmation-modal/confirmation-modal.component';
import { FileUploadModalComponent } from "../controls/modals/file-upload-modal/file-upload-modal.component";
import * as numeral from 'numeral'; 

@Injectable({
  providedIn: 'root'
})
export class UtilService {



  constructor(private modal: NgbModal, private toast: ToastService, private router: Router) {
  }

  public compressUri(jsonData: any): string {
    return compressToEncodedURIComponent(JSON.stringify(jsonData));
  }

  public decompressUri<T>(data: string): T | null {
    const spc = decompressFromEncodedURIComponent(data);
    if (spc == null)
      return null;

    return JSON.parse(spc) as T;
  }

  public async confirmModal(message: string, title: string | null = null, isHtml: boolean = false, opts: NgbModalOptions | null = null): Promise<boolean> {
    try {
      const mdl = this.modal.open(ConfirmationModalComponent, opts);
      mdl.componentInstance.message = message;
      mdl.componentInstance.isHtml = isHtml;
      mdl.componentInstance.title = title;
      return await mdl.result as boolean;
    } catch (ex) {
    }
    return false;
  }

  /**
   * 
   * @param dataSource 
   * @param title 
   * @param data 
   * @param options  
   * {
   *   extensions: {".xlsx": 'Excel File (xlsx)'}
   * }
   * @returns 
   */
  public async uploadModal(dataSource: string, title: string | null = null, data: any | null = null, options: any | null = null): Promise<any> {
    try {
      const mdl = this.modal.open(FileUploadModalComponent, { centered: true,  size: 'lg' });
      mdl.componentInstance.appdata = data;
      mdl.componentInstance.title = title;
      mdl.componentInstance.dataSource = dataSource;
      mdl.componentInstance.options = options;
      return await mdl.result;
    } catch (ex) {
    }
    return false;
  }

  //toast
  public showToast(data: string, type: ToastType = ToastType.Normal, isHtml: boolean = false) {

    var clss = 'bg-light';
    var delay = 3000;
    switch (type) {
      case ToastType.Success:
        clss = 'bg-success text-light';
        break;
      case ToastType.Warning:
        clss = 'bg-warning text-light';
        break;
      case ToastType.Danger:
        clss = 'bg-danger text-light';
        delay = 5000;
        break;
    }

    this.toast.show(data, { classname: clss, delay: delay, isHtml: isHtml });
  }

  public preNavigate(route: Array<any>) {
    const args = this.compressUri(route);
    this.router.navigate(['home', 'preloader', args]);
  }

  public async showModal<T>(component: any, data: any | null = null, size?: 'sm' | 'lg' | 'xl' | string, fullscreen?: boolean): Promise<T | null> {
    try {
      const mdl = this.modal.open(component, { centered: true, scrollable: true, size: size, fullscreen: fullscreen });
      if (data !== null) {
        for (var key of Object.keys(data))
          mdl.componentInstance[key] = data[key];
      }
      return await mdl.result as T;
    } catch (ex) {
      console.error(ex);
    }
    return null;
  }

  public formatError(error: string | any | null): string {
    if (error === null || error === undefined)
      return '';

    let err = error;
    if (error instanceof Object) {
      err = error.error.message
    }

    let repl = '<br/>';
    let msg = err.replace(/(0x\w*: )/gm, `$1${repl}`);
    msg = msg.replace(/\n/gm, repl);
    return msg;
  }

  async clipboard(value: any) {

    var clipboardFallback = (value: any) => {
      var textArea = document.createElement("textarea");
      textArea.value = value;

      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
      } finally {
        document.body.removeChild(textArea);
      }
    }

    if (!navigator.clipboard) {
      clipboardFallback(value);
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      console.log('Async: Copying to clipboard was successful!');
    } catch (err) {
      console.error('Async: Could not copy text: ', err);
    }
  }

  formatDate(value: any | null, format: any | null = null) {
    if (value === undefined || value === null)
      return '-';
    return moment(value).format(format || 'MM/DD/YYYY');
  }

  toJsonDate(value: any | null, format: any | null = null) {
    if (value === undefined || value === null)
      return null;

    if (value instanceof Date)
      return moment(value).toJSON();
    return moment(value, format || 'MM/DD/YYYY').toJSON();
  }

  humanize(data: any | null) {
    try {
      if (data === null || data === undefined) {
        return data;
      }
      var rgx = new RegExp(`(?<=.{1})([A-Z])`, 'g');
      return data.replace(rgx, ' $1');
    } catch (ex) {
      console.error(ex);
      return data;
    }
  }

  fixedDecimal(s: string) {
    return parseFloat(s || '0').toFixed(2);
  }

  parseBool(value: any) {
    if (value === true || value === 'true' || value === 'TRUE' || value === 1 || value === '1')
      return true;

    if (value === false || value === 'false' || value === 'FALSE' || value === 0 || value === '0')
      return false;

    return null;
  }

  min<T>(arr: Array<T>, selector: (value: T, index: number, array: T[]) => any): number {
    if (arr.length == 0)
      return 0;
    return Math.min(...arr.map(selector));
  }

  max<T>(arr: Array<T>, selector: (value: T, index: number, array: T[]) => any): number {
    if (arr.length == 0)
      return 0;
    return Math.max(...arr.map(selector));
  }

  stringDivider(str: any, width: number, spaceReplacer: any): any {
    if (str.length > width) {
      let p = width;
      while (p > 0 && str[p] != ' ' && str[p] != '-') {
        p--;
      }
      if (p > 0) {
        let left;
        if (str.substring(p, p + 1) == '-') {
          left = str.substring(0, p + 1);
        } else {
          left = str.substring(0, p);
        }
        const right = str.substring(p + 1);
        return left + spaceReplacer + this.stringDivider(right, width, spaceReplacer);
      }
    }
    return str;
  }

  async notifyUser(message: any, title: any) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      return;
    }
    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var notification = new Notification(title, {
        body: message
      });
    }
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      var permission = await Notification.requestPermission();
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification(title, {
          body: message
        });
      }
    }
  }

  generateRandomNumber() {
    return (Math.random() * (999999999 - 10000 + 1)) << 0;
  }

  regex(pattern: RegExp, value: any): Array<any> {
    let m;
    const mpc: Array<any> = [];

    while ((m = pattern.exec(value)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === pattern.lastIndex) {
        pattern.lastIndex++;
      }
      m.forEach((match, groupIndex) => {
        mpc.push(match);
      });
    }
    return mpc;
  }

  convertSize(size: number, units: SizeUnit): number {
    const nt = units.valueOf();
    return parseFloat((size / Math.pow(1000, nt)).toFixed(2));
  }

  param(prm: any): string {
    if (prm === null)
      return "1=1";

    const ntc = [];
    for (const pr of Object.keys(prm)) {
      if (prm[pr] instanceof Array) {
        for (const p of prm[pr])
          ntc.push(`${pr}=${p}`);
      } else
        ntc.push(`${pr}=${prm[pr]}`);
    }
    return ntc.join('&');
  }

  currency(value: number | null) {
    if (value === null || undefined || value === 0) {
      return null;
    }
    return numeral(value).format('(0,0.00)');
  }

  decurrency(value: string): number {
    if (value === null || value === undefined) {
      return 0;
    }
    return parseFloat(value.replace(/[, ]+/g, ''));
  }

  hasNumericValue(data: any | null): boolean {
    if (data === null || data === undefined)
      return false;
    return !isNaN(data)
  }

  firstWord(word: string | null): string | null {
    if (word === null) return null
    return word.replace(/ .*/, '')
  }
 

  upsertArray = <T>(arr: Array<T>, filter: (f: T) => boolean, data: T): Array<T> => {
    const newArray = [...arr];

    const item = newArray.findIndex(filter);
    if (item > -1) {
      newArray[item] = data;
    } else {
      newArray.push(data);
    }

    return newArray;
  }

  isNull(data: any | null): Boolean {
    return data === null || data === undefined;
  }

  isObject(data: any | null) : Boolean {
    return typeof data === 'object' && data !== null && !Array.isArray(data);
  }
}

export enum SizeUnit {
  Byte, KB, MB, GB, TB, PB, EB, ZB, YB
}
