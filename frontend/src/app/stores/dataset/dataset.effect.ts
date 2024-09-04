import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ApiService } from "../../services/api.service";
import { loading } from "../app.action";
import { catchError, mergeMap, NEVER, never, of, switchMap, tap, throwError } from "rxjs";
import {
  DATA_ERROR,
  dataError,
  LOAD_DATALIST,
  loadDataListSuccess,
  LOAD_DATAINFO,
  loadDataInfoSuccess,
  SAVE_DATAINFO,
  saveDataInfoSuccess,
  deleteDataInfoSuccess,
  DELETE_DATAINFO,
  BUTTON_ACTION,
  buttonActionSuccess,
  buttonActionFailed,
  DOWNLOAD,
  LOAD_DATALOOKUP,
  loadDataLookUpSuccess
} from "./dataset.action";
import { Store } from "@ngrx/store";
import { UtilService } from "../../services/util.service";
import { ToastType } from "../../services/toast.service";


@Injectable()
export class DataEffect {
  constructor(
    private action$: Actions,
    private api: ApiService,
    private store: Store,
    private util: UtilService
  ) {
  }

  loadDataList$ = createEffect(() =>
    this.action$.pipe(
      ofType(LOAD_DATALIST),
      tap(() => {
        this.store.dispatch(loading({ loading: true }))
      }),
      mergeMap(({
        dataSource,
        skip,
        take,
        filter
      }) => this.api.get(`${dataSource}/${skip}/${take}?${this.util.param(filter)}`).pipe(
        switchMap((res: any) => [
          loadDataListSuccess({ data: res.data, count: res.count }),
          loading({ loading: false })
        ]),
        catchError((err) =>
          of(err).pipe(
            switchMap((err: any) => [
              dataError({ error: err }),
              loading({ loading: false })
            ])
          )
        ))
      )
    ));

  loadDataInfo$ = createEffect(() =>
    this.action$.pipe(
      ofType(LOAD_DATAINFO),
      tap(() => {
        this.store.dispatch(loading({ loading: true }))
      }),
      mergeMap(({
        dataSource,
        id,
        controller
      }) => this.api.get(`${(controller || 'api')}/${dataSource}/${id}`, { fullPath: true }).pipe(
        switchMap((res: any) => [
          loadDataInfoSuccess({ data: res }),
          loading({ loading: false })
        ]),
        catchError((err) =>
          of(err).pipe(
            switchMap((err: any) => [
              dataError({ error: err }),
              loading({ loading: false })
            ])
          )
        ))
      )
    )
  );

  saveDataInfo$ = createEffect(() =>
    this.action$.pipe(
      ofType(SAVE_DATAINFO),
      tap(() => {
        this.store.dispatch(loading({ loading: true }))
      }),
      mergeMap(({ dataSource, data, options }) => this.api.post(dataSource, data, options).pipe(
        switchMap((res: any) => [
          saveDataInfoSuccess({ data: res }),
          loading({ loading: false })
        ]),
        catchError((err) =>
          of(err).pipe(
            switchMap((err: any) => [
              dataError({ error: err }),
              loading({ loading: false })
            ])
          )
        ))
      )
    )
  );

  deleteDataInfo$ = createEffect(() =>
    this.action$.pipe(
      ofType(DELETE_DATAINFO),
      tap(() => {
        this.store.dispatch(loading({ loading: true }))
      }),
      mergeMap(({ dataSource, id }) => this.api.delete(`${dataSource}/${id}`).pipe(
        switchMap(() => [
          deleteDataInfoSuccess(),
          loading({ loading: false })
        ]),
        catchError((err) =>
          of(err).pipe(
            switchMap((err: any) => [
              dataError({ error: err }),
              loading({ loading: false })
            ])
          )
        )
      ))
    )
  );

  buttonAction$ = createEffect(() =>
    this.action$.pipe(
      ofType(BUTTON_ACTION),
      tap(() => {
        this.store.dispatch(loading({ loading: true }))
      }),
      mergeMap(({ name, method, dataSource, data, notifyChanged, fullPath }) => this.requstDecider(method, null, dataSource, data, fullPath).pipe(
        switchMap((data) => [
          buttonActionSuccess({ name: name, data: data, notifyChanged: notifyChanged }),
          loading({ loading: false })
        ]),
        catchError((err) =>
          of(err).pipe(
            switchMap((err: any) => [
              buttonActionFailed({ name: name, error: err }),
              dataError({ error: err }),
              loading({ loading: false })
            ])
          )
        )
      ))
    )
  )

  download$ = createEffect(() =>
    this.action$.pipe(
      ofType(DOWNLOAD),
      tap(() => {
        this.store.dispatch(loading({ loading: true }))
      }),
      mergeMap(({ dataSource, data }) => this.api.downloadFile(dataSource, data).pipe(
        switchMap((data) => [
          loading({ loading: false })
        ]),
        catchError((err) =>
          of(err).pipe(
            switchMap((err: any) => [
              dataError({ error: err }),
              loading({ loading: false })
            ])
          )
        )
      ))
    )
  )

  loadDataLookUp$ = createEffect(() =>
    this.action$.pipe(
      ofType(LOAD_DATALOOKUP),
      mergeMap(({
        name,
        dataSource,
        filter,
        controller
      }) => this.api.get(`${(controller || 'api')}/${dataSource}?${this.util.param(filter)}`, { fullPath: true }).pipe(
        switchMap((res: any) => [
          loadDataLookUpSuccess({ data: res, name: name })
        ]),
        catchError((err) =>
          of(err).pipe(
            switchMap((err: any) => [
              dataError({ error: err })
            ])
          )))
      )
    ));

  dataError$ = createEffect(() =>
    this.action$.pipe(
      ofType(DATA_ERROR),
      switchMap(({ error }) => {
        this.util.showToast(this.util.formatError(error), ToastType.Danger, true);
        return NEVER;
      })
    )
    , { dispatch: false });

  requstDecider = (method: 'post' | 'get', controller: string | null, dataSource: string, filter: any, fullPath?: boolean) => {

    var path = `${(controller || 'api')}/${dataSource}`;
    if (fullPath == true)
      path = dataSource;
      
    const opt = {
      fullPath: true
    };

    switch (method) {
      case 'get':
        return this.api.get(`${path}?${this.util.param(filter)}`, opt);
      case 'post':
        return this.api.post(path, filter, opt);
    }
  }
}
