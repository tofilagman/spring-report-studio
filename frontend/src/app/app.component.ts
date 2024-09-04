import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilService } from './services/util.service';
import { selectLoading, selectSideBar } from './stores/app.selector';
import { sideBarToggle } from './stores/app.action';
import { selectDataLookUp } from './stores/dataset/dataset.select';
import { buttonAction } from './stores/dataset/dataset.action';
import { CookieService } from './services/cookie.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public sideBar$: Observable<boolean> | null = null;
  public adminLoader: string = "adminLoader";

  public profile = {
    app_id: null,
    expires_in: null,
    hub_domain: null,
    scopes: [],
    token: null,
    token_type: null,
    user: null,
    user_id: null
  }

  constructor(private store: Store, private spinner: NgxSpinnerService, private util: UtilService, private cookie: CookieService) {
  }

  ngOnInit(): void {
    this.store.select(selectLoading).subscribe((value: boolean) => {
      if (value)
        this.spinner.show(this.adminLoader);
      else
        this.spinner.hide(this.adminLoader);
    });

    this.sideBar$ = this.store.select(selectSideBar);

    this.store.select(selectDataLookUp("profile")).subscribe((value: any) => {
      this.profile = value;
    });

    const uid = this.cookie.get('uid');
    if (uid)
      this.store.dispatch(buttonAction({
        name: 'profile',
        method: 'get',
        dataSource: `user/profile/${uid}`,
        data: null,
        notifyChanged: false
      }));
    else
      window.location.href = "/";
  }

  ngOnDestroy() {

  }


  sideBarToggle() {
    this.store.dispatch(sideBarToggle());
  }

  logOut(){
    this.cookie.clear();
  }

}