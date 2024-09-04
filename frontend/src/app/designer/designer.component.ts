import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UtilService } from '../services/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { SetupComponent } from './setup/setup.component';
import { BindingPropertyComponent } from './binding-property/binding-property.component';
import { buttonAction, destroyAllLookUp, download } from '../stores/dataset/dataset.action';
import { selectDataLookUp, selectError } from '../stores/dataset/dataset.select';
import { NEVER, Subscription, catchError, map, of, switchMap } from 'rxjs';
import { ResourceComponent } from './resource/resource.component';
import { EditorComponent } from 'ngx-monaco-editor-v2';

@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.scss']
})
export class DesignerComponent implements OnInit {
  public crumbs: Array<string> = ['My Templates', 'Designer'];

  showReport = true;
  private editor: any
  public orientations: Array<any> = [
    { id: 1, name: 'Portrait' },
    { id: 2, name: 'Landscape' }
  ];

  public mceInit = {
    base_url: `${this.locationStrategy.getBaseHref()}tinymce`,
    suffix: '.min',
    height: '75vh',
    plugins: [
      'advlist', 'autolink',
      'lists', 'link', 'image', 'charmap', 'anchor', 'searchreplace', 'visualblocks',
      'insertdatetime', 'media', 'table', 'help', 'wordcount'
    ],
    toolbar:
      'customPreview | undo redo | casechange blocks | bold italic backcolor | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist checklist outdent indent | removeformat | table',
    setup: (e: any) => {
      // e.ui.registry.addButton('customPreview', {
      //   text: 'Open Document',
      //   onAction: this.openDocument.bind(this)
      // });
      this.editor = e;
    }
  }

  public data: any = {
    id: 0,
    name: null,
    body: null,
    base64Data: null,
    properties: null
  }

  editorOptions = { theme: 'vs-dark', language: 'html', automaticLayout: true };
  dataEditorOptions = { language: 'json', automaticLayout: true };
  scriptOptions = { ...this.editorOptions, language: 'javascript' };
  styleOptions = { ...this.editorOptions, language: 'css' };

  private errorSub: Subscription | null = null;

  constructor(private store: Store, private util: UtilService, private router: Router,
    private activatedRoute: ActivatedRoute, private locationStrategy: LocationStrategy) {
  }

  ngOnInit(): void {
    this.store.select(selectDataLookUp('pdf-preview')).subscribe(x => {
      if (x === null || x.length === 0) return;
      this.data = {
        ...this.data,
        base64Data: x
      }
    });


    this.activatedRoute.paramMap.pipe(
      map((x: any) => this.util.decompressUri(x.params.id)),
      switchMap((x: any) => {
        this.store.dispatch(buttonAction({
          name: 'template-info',
          dataSource: "template/LoadFullInfo",
          method: 'post',
          data: {
            id: x.id
          },
          notifyChanged: true
        }));
        return NEVER;
      }),
      catchError((err) => of(err).pipe(
        switchMap((err: any) => [
          this.router.navigate(['home', 'error'], { queryParams: { ex: err } })
        ])
      ))
    ).subscribe();

    this.store.select(selectDataLookUp('template-info')).subscribe((x: any) => {
      if (x === null || x.length === 0) return;
      this.data = {
        ...x
      };
    });

    this.errorSub = this.store.select(selectError).subscribe(async (x: any) => {
      if (x) {
        console.log(x);
        const formattedError = this.util.formatError(x.error);
        await this.util.confirmModal(formattedError, "Rendering error", true, { scrollable: true, size: 'xl' });
      }
    });
  }

  refresh() {

  }

  save() {
    this.store.dispatch(buttonAction({
      name: 'template-info',
      dataSource: "template/SaveFull",
      method: 'post',
      data: {
        id: this.data.id,
        body: this.data.body,
        param: this.data.param,
        script: this.data.script,
        style: this.data.style
      },
      notifyChanged: true
    }));
  }

  ngOnDestroy(): void {
    this.errorSub?.unsubscribe();
    this.store.dispatch(destroyAllLookUp());
  }

  showPreview() {
    this.store.dispatch(buttonAction(
      {
        name: 'pdf-preview',
        dataSource: 'pdf/render',
        data: {
          id: this.data.id,
          template: this.data.body,
          orientation: this.data.orientation,
          documentType: this.data.documentType,
          data: this.data.param,
          script: this.data.script,
          style: this.data.style,
          margin: {
            top: this.data.mTop,
            left: this.data.mLeft,
            bottom: this.data.mBottom,
            right: this.data.mRight
          }
        },
        method: 'post',
        notifyChanged: false
      }
    ))

  }

  async setup() {
    const res: any = await this.util.showModal(SetupComponent, { id: this.data.id });
    if (res) {
      this.data = {
        ...this.data,
        ...res
      }
      this.crumbs[2] = this.data.name;
    }
  }

  async openDocument() {
    const res = await this.util.uploadModal('pdf/upload-doc', 'Upload Document', null, {
      extensions: { ".docx": 'Word File (docx)' },
      maxUploadSize: 5000 * 1024
    });
    this.data = {
      ...this.data,
      body: res
    }
  }

  async resources() {
    const res = await this.util.showModal(ResourceComponent, { id: this.data.id }, 'xl');
    if (res) {
      this.data = {
        ...this.data,
        body: res
      }
    }
  }

  onCodeInit(editor) {
    var apc = function (editor, trial) {
      var mpc = setTimeout(() => {
        clearTimeout(mpc);
        trial++;

        if (trial > 10) return;

        var nVal = editor.getValue();
        if (nVal != null && nVal != undefined && nVal != "") {
          editor.trigger(
            "anyString",
            "editor.action.formatDocument",
            null
          );
        } else
          apc(editor, trial);
      }, 1000);
    }

    apc(editor, 1);
  }

  async import() {
    const res = await this.util.uploadModal('pdf/import', 'Import Template', { id: this.data.id }, {
      extensions: { ".json": 'Pdf Template (json)' },
      maxUploadSize: 5000 * 1024
    });
    if (res) {
      await this.util.confirmModal("Import Success", "Template Maintenance");
      window.location.reload();
    }
  }

  export() {
    this.store.dispatch(download({
      dataSource: 'pdf/export',
      data: {
        id: this.data.id
      }
    }))
  }

}