import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NEVER, Subscription, catchError, map, of, switchMap } from 'rxjs';
import { UtilService } from 'src/app/services/util.service';
import { buttonAction, destroyAllLookUp, download } from 'src/app/stores/dataset/dataset.action';
import { selectDataLookUp, selectError } from 'src/app/stores/dataset/dataset.select';

@Component({
  selector: 'app-custom-code',
  templateUrl: './custom-code.component.html',
  styleUrls: ['./custom-code.component.scss']
})
export class CustomCodeComponent implements OnInit {
  public crumbs: Array<string> = ['Endpoints', 'Custom Code'];

  public data: any = {
    id: 0,
    preRequest: null,
    preRequestData: null,
    postRequest: null,
    result: null,
    pdf: null
  }

  showResult = true;

  editorOptions = { theme: 'vs-dark', language: 'javascript', automaticLayout: true };
  dataEditorOptions = { language: 'json', automaticLayout: true };
  scriptOptions = { ...this.editorOptions, language: 'javascript' };
  resultEditorOptions = { ...this.editorOptions, language: 'json' }; //,  readOnly: true 

  private errorSub: Subscription | null = null;

  constructor(private store: Store, private util: UtilService, private router: Router,
    private activatedRoute: ActivatedRoute, private locationStrategy: LocationStrategy) {
  }

  ngOnInit(): void {
    this.store.select(selectDataLookUp('endpoint-test')).subscribe((x: any) => {
      if (x === null || x.length === 0) return;
      this.data = {
        ...this.data,
        result: JSON.stringify({
          logs: x.logs,
          data: x.data
        } || {}),
        pdf: x.pdf
      }
    });


    this.activatedRoute.paramMap.pipe(
      map((x: any) => this.util.decompressUri(x.params.id)),
      switchMap((x: any) => {
        this.store.dispatch(buttonAction({
          name: 'endpoint-code-info',
          dataSource: "endpoint/loadCodeInfo",
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

    this.store.select(selectDataLookUp('endpoint-code-info')).subscribe((x: any) => {
      if (x === null || x.length === 0) return;
      this.data = {
        ...x
      };
    });

    this.errorSub = this.store.select(selectError).subscribe(async (x: any) => {
      if (x) {
        const formattedError = this.util.formatError(x.error);
        await this.util.confirmModal(formattedError, "Rendering error", true, { scrollable: true, size: 'xl' });
      }
    });
  }

  refresh() {

  }

  save() {
    this.store.dispatch(buttonAction({
      name: 'endpoint-code-info',
      dataSource: "endpoint/saveCodeInfo",
      method: 'post',
      data: {
        id: this.data.id,
        preRequest: this.data.preRequest,
        preRequestData: this.data.preRequestData,
        postRequest: this.data.postRequest
      },
      notifyChanged: true
    }));
  }

  ngOnDestroy(): void {
    this.errorSub?.unsubscribe();
    this.store.dispatch(destroyAllLookUp());
  }

  test() {
    this.store.dispatch(buttonAction(
      {
        name: 'endpoint-test',
        dataSource: 'endpoint/test',
        data: {
          id: this.data.id,
          preRequest: this.data.preRequest,
          preRequestData: this.data.preRequestData,
          postRequest: this.data.postRequest
        },
        method: 'post',
        notifyChanged: false
      }
    ))
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
    const res = await this.util.uploadModal('endpoint/import', 'Import Endpoint', { id: this.data.id }, {
      extensions: { ".json": 'Endpoint Template (json)' },
      maxUploadSize: 5000 * 1024
    });
    if (res) {
      await this.util.confirmModal("Import Success", "Endpoint Maintenance");
      window.location.reload();
    }
  }

  export() {
    this.store.dispatch(download({
      dataSource: 'endpoint/export',
      data: {
        id: this.data.id
      }
    }))
  }
}
