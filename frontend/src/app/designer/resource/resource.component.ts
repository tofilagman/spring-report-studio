import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store'; 
import { UtilService } from 'src/app/services/util.service';
import { buttonAction, deleteDataInfo } from 'src/app/stores/dataset/dataset.action';
import { selectActionCounter, selectDataLookUp } from 'src/app/stores/dataset/dataset.select';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit, OnDestroy {

  @Input() id: number | null = null;

  options = {
    contextmenu: true,
    minimap: {
      enabled: true
    },
  };

  list: Array<any> = [];

  constructor(public activeModal: NgbActiveModal, private store: Store, private util: UtilService, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.store.select(selectDataLookUp('resources')).subscribe(x => {
      if (x === null || x.length === 0) return;
      this.list = x;
    });

    this.store.select(selectActionCounter).subscribe(x => {
      this.loadList();
    });

    this.loadList();
  }

  onSubmit() {
    this.activeModal.close();
  }

  ngOnDestroy() {
    this.id = null;
  }

  onFormEnter() {
    return false;
  }
 
  async upload() {
    const res = await this.util.uploadModal('template-resource/upload', 'Upload Image Resource', {
      idTemplate: this.id
    }, {
      extensions: { ".jpg": 'Image File (JPG)', ".jpeg": "Image File (JPEG)", ".png": "Image File (PNG)" },
      maxUploadSize: 5000 * 1024
    });

    this.list = [...this.list, res]; 
  }

  buildUrl(data: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:${data.fileType};base64,${data.thumbNail}`);
  }

  copyLinkItem(evt: any) { 
    this.util.clipboard(`{{resource '${evt.value.cuid}'}}`);
  }

  loadList(){
    this.store.dispatch(buttonAction({
      name: 'resources',
      dataSource: `template-resource/LoadList/${this.id}`,
      method: 'get',
      data: null,
      notifyChanged: false
    }));
  }

  async deleteItem(evt: any) { 
    if (await this.util.confirmModal(`Continue to delete this resource?`, 'Resource delete')) {
      this.store.dispatch(buttonAction({
        name: 'delete-resources',
        dataSource: `template-resource/delete`,
        method: 'post',
        data: { id: evt.value.id },
        notifyChanged: true
      }));
    }
  }
}