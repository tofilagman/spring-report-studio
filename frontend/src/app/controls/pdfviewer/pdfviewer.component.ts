import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { AppEventService } from 'src/app/services/event.service';

@Component({
  selector: 'pdfviewer',
  templateUrl: './pdfviewer.component.html',
  styleUrls: ['./pdfviewer.component.scss']
})
export class PDFViewerComponent implements OnInit, OnDestroy {

  xheight: string = '90vh';
  private xval: string | null = null;
  private pdf: any | null = null;

  @Input() set base64Data(value: string | null) {
    if (value === null) return;
    this.xval = value;
    if (this.pdf !== null)
      this.pdf.open(value);
  }

  @Input() set height(value: string) {
    this.xheight = value;
  }

  constructor(private event: AppEventService) {
    window['WebPdfViewer'] = event;
    window['WebPdfViewer'].subscribe(this.register.bind(this));
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    window['WebPdfViewer'].unsubscribe(this.register.bind(this));
    this.pdf = null;
    this.xval = null;
  }

  private register(ev: any, obj: any) {
      this.pdf = obj
      if (this.xval !== null && this.xval !== undefined)
        this.pdf.open(this.xval);
  }

}
