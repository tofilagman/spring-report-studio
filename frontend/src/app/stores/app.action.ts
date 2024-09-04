import { createAction, props } from '@ngrx/store'; 

//login
export const LOGIN = "[AUTH] Login";
export const LOGIN_FAILED = "[AUTH] Login Failed";
export const LOGIN_SUCCESS = "[AUTH] Login Success";
export const LOGIN_RESET = "[AUTH] Login Reset";
export const LOGOUT = "[AUTH] Logout";
export const LOGOUT_COMPLETE = "[AUTH] Logout Complete";
export const AUTHORIZE = "[AUTH] Authorize";

//reset account
export const RESET_ACCOUNT = "[AUTH] Reset Account";
export const RESET_ACCOUNT_SUCCESS = "[AUTH] Reset Account Success";
export const RESET_ACCOUNT_FAILED = "[AUTH] Reset Account Failed";

export const SIDEBAR = "[SIDEBAR]";
export const SIDEBAR_INIT = "[SIDEBAR] Init";
export const SIDEBAR_TOGGLE = "[SIDEBAR] Toggle";

export const USERPROFILE_INIT ="[USERPROFILE] Init";
export const USER_PROFILE_CITY = "[USERPROFILE] City";

export const LOADING = "[LOADING]"; 

export const logOut = createAction(LOGOUT);
export const logOutComplete = createAction(LOGOUT_COMPLETE);

export const resetAccount = createAction(RESET_ACCOUNT, props<{ uid: string, token: string, newPassword: string, confirmPassword: string }>());
export const resetAccountSuccess = createAction(RESET_ACCOUNT_SUCCESS);
export const resetAccountFailed = createAction(RESET_ACCOUNT_FAILED, props<{ error: any }>());

export const sideBar = createAction(SIDEBAR);
export const sideBarInit = createAction(SIDEBAR_INIT, props<{ isOpen: boolean }>());
export const sideBarToggle = createAction(SIDEBAR_TOGGLE);
   
export const loading = createAction(LOADING, props<{ loading: boolean }>());

