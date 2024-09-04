import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ApiService } from "../services/api.service";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { NEVER, of, switchMap } from "rxjs";
import {
  SIDEBAR,
  SIDEBAR_TOGGLE,
  sideBarInit
} from "./app.action";
import { Store } from "@ngrx/store";

@Injectable()
export class AppEffect {
  constructor(
    private action$: Actions,
    private api: ApiService,
    private router: Router,
    private store: Store
  ) {
  }

  sideBar$ = createEffect(() =>
    this.action$.pipe(
      ofType(SIDEBAR),
      switchMap(() => of((localStorage.getItem('sb|sidebar-toggle') || 'false') === 'true').pipe(
        switchMap((isOpen: boolean) => [
          sideBarInit({ isOpen: isOpen })
        ])
      ))
    )
  )

  sideBarToggle$ = createEffect(() =>
    this.action$.pipe(
      ofType(SIDEBAR_TOGGLE),
      switchMap(() => {
        const toggle = (localStorage.getItem('sb|sidebar-toggle') || 'false') === 'true';
        localStorage.setItem('sb|sidebar-toggle', String(!toggle));
        return NEVER;
      })
    ), { dispatch: false }
  )


}
