import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { catchError, map, NEVER, Observable, switchMap, tap, throwError as observableThrowError } from "rxjs";
import * as download from 'downloadjs';
import * as $ from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private router: Router) {
  }

  public request(method: string, url: string, options?: any): Observable<any> {
    options = options || {};

    if (!(options.headers && (options.headers instanceof HttpHeaders))) {
      options.headers = new HttpHeaders(options.headers || null);
    }

    options.headers = options.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    options.headers = options.headers.set('Pragma', 'no-cache');
    options.headers = options.headers.set('Expires', '0');
    options.headers = options.headers.set('Accept', 'application/json');

    const token = window.localStorage.getItem('token') || null;

    if (token)
      options.headers = options.headers.set('Authorization', `Bearer ${token}`);

    options.credentials = "same-origin";

    // Request Options:
    options.observe = 'response';
    options.responseType = options.responseType || 'json';

    let urlPath = this.getAbsoluteUrl(['api', url].join("/"));
    if (options.fullPath)
      urlPath = this.getAbsoluteUrl(url);

    return this.http.request(method, urlPath, options).pipe(
      map((r) => {
        if (options.handleResponse)
          return options.handleResponse(r);
        else
          return (r as unknown as HttpResponse<any>).body;
      }),
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  public delete<T>(url: string, options?: any): Observable<T> {
    return this.request('DELETE', url, options);
  }

  public get<T>(url: string, options?: any): Observable<T> {
    return this.request('GET', url, options);
  }

  public post<T>(url: string, body?: any | null, options?: any): Observable<T> {
    (options = options || {}).body = this.stringify(body);
    return this.request('POST', url, options);
  }

  protected handleError(error: any) {
    if (error instanceof HttpErrorResponse) {

      switch (error.status) {
        case 302:
          //this.pageService.redirectTo(WbPages.MENU);
          break;
        case 401:
        case 504: //gateway timeout
          this.router.navigateByUrl('login').finally();
          break;
        case 409:
        case 500:
        case 503:
          /*this.displayError(error);*/
          break;
      }
    }

    return observableThrowError(error);
  }

  protected stringify(jsonData: any) {
    if (jsonData === null || jsonData === undefined) {
      return null;
    }

    return jsonData;
  }

  protected getAbsoluteUrl(relativeUrl: string): string {
    return document.location.protocol + "//" + document.location.host + "/" + relativeUrl;
  }

  downloadFile(url: string, body?: any | null, options?: any): Observable<void> {

    (options = options || {}).body = this.stringify(body);
    (options = options || {}).responseType = 'arrayBuffer';
    (options = options || {}).handleResponse = (x: any) => {
      return x;
    }

    return this.request('POST', url, options).pipe(
      tap((x: any) => {
        var blob = x.body;
        var fname = x.headers.get("content-disposition");

        var getFileName = (fname: string) => {
          const regex = /filename[^;=\n]*=(?:(\\?['"])(.*?)\1|(?:[^\s]+'.*?')?([^;\n]*))/gm;

          var ms: Array<string> = [];
          let m;
          while ((m = regex.exec(fname)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
              regex.lastIndex++;
            }

            m.forEach((match, groupIndex) => {
              ms.push(match);
            });
          }

          return (ms as any).findLast((x: any) => x !== undefined && x !== null)
        };

        download(blob, getFileName(fname));

      })
    );
  }

  public async uploadFileProgress(arg: UploadArgs): Promise<any> { //JQuery.jqXHR<any>
    var data = new FormData();
    data.append('file', arg.file);

    if (arg.body !== null) {
      for (const b of Object.keys(arg.body))
        data.append(b, arg.body[b]);
    }
    const token = window.localStorage.getItem('token') || null;
    var urlPath = ['api', arg.url].join("/");
    if (arg.fullPath)
      urlPath = arg.url;

    return $.ajax({
      xhr: () => {
        let xhr = new window.XMLHttpRequest();

        xhr.upload.addEventListener('progress', evt => {
          if (evt.lengthComputable) {
            let percentComplete = evt.loaded / evt.total;
            percentComplete = Math.abs(percentComplete * 100);
            arg?.progress(percentComplete);
          }
        }, false);

        return xhr;
      },
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      url: urlPath,
      type: 'POST',
      data: data,
      contentType: false,
      processData: false,
      success: result => {
        arg?.success(result);
      },
      error: (error) => {
        arg?.error(error.responseText);
      }
    });
  }
}

export interface UploadArgs {
  url: string,
  file: any,
  body: any | null,
  fullPath?: boolean,
  progress: (percent: number) => void | null,
  success: (result: any) => void | null,
  error: (error: string) => void | null
}
