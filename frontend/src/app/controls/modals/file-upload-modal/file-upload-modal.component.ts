import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Store} from '@ngrx/store';
import {SizeUnit, UtilService} from "../../../services/util.service";
import {ApiService} from "../../../services/api.service";


@Component({
  selector: 'lib-file-upload-modal',
  templateUrl: './file-upload-modal.component.html',
  styleUrls: ['./file-upload-modal.component.scss']
})
export class FileUploadModalComponent implements OnInit {

  public data: any = {}
  public uploadTitle: string = "Upload";
  private uploadData: any = {}

  @Input() dataSource: string = "";
  @ViewChild('input') inputFile!: ElementRef;

  @Input()
  set title(value: string | null) {
    this.uploadTitle = value || "Upload";
  }

  @Input()
  set appdata(value: any | null) {
    this.uploadData = {...this.uploadData, ...value};
  }

  @Input()
  set options(value: any | null) {
    this.fOptions = value;
  }
 
  file: any = null;
  startDisabled: boolean = true;
  private maxUploadSize: number | null = null;
  private fOptions: any | null = null;

  constructor(public activeModal: NgbActiveModal, private util: UtilService, private store: Store, private api: ApiService) {
  }

  ngOnInit(): void {
    this.uploadTitle = `Upload`;
    this.maxUploadSize = 5000; //Bytes
  }

  onFileChange(event: any) {
    var selectedFile: Array<any> = event.target.files;

    if (selectedFile.length <= 0) {
      this.file = null;
      return;
    }

    this.file = selectedFile[0];
    event.target.value = null;
  
    var mSize = this.maxUploadSize;
    if(this.fOptions.maxUploadSize) 
      mSize = this.fOptions.maxUploadSize;

    //validate file
    const uploadedSize = this.util.convertSize(this.file.size, SizeUnit.KB);
    const maxSize = this.util.convertSize(mSize!!, SizeUnit.KB);
  
    if (uploadedSize > maxSize) {
      this.data.error = `Invalid file size, should not exceed ${maxSize} Kilobytes`;
      this.startDisabled = true;
      return;
    }

    const filename = this.file.name;
    const ext = this.util.regex(/(\.\w+)$/gm, filename);
    if (!this.getExtensionFilter().some(x => x === ext[0])) {
      this.data.error = `Invalid file type, should be ${this.getValidFileDisplay()}`;
      this.startDisabled = true;
      return;
    }

    this.startDisabled = false;
  }

  removeUpload() {
    this.file = null;
    this.data.error = null;
  }

  //todo: isolated, for future implement ngrx
  async uploadFile() {
    try {
      await this.api.uploadFileProgress({
        url: this.dataSource!,
        file: this.file,
        body: this.uploadData,
        fullPath: this.fOptions.fullPath || false,
        progress: (percent: any) => {
          this.data.status = 'Uploading';
          this.data.percent = percent;
          if (percent >= 100) {
            this.data.status = 'Processing';
          }
        },
        success: (result: any) => {
          this.activeModal.close(result);
        },
        error: (error: any) => {
          this.data.error = error;
        }
      });
    } catch (ex) {
      console.error(ex);
    }
  }

  private getExtensionFilter(): Array<string> {
    if (this.fOptions == null) return [];
    return Object.keys(this.fOptions.extensions) 
  }

  getValidFileDisplay(): string {
    if (this.fOptions == null) return "";
    return Object.keys(this.fOptions.extensions).map(x => this.fOptions.extensions[x]).join(', ');  
  }
}
