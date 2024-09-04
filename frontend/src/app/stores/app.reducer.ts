import { AppState } from "./app.state";
import { createReducer, on } from "@ngrx/store";
import {
  loading,   resetAccount, resetAccountFailed, resetAccountSuccess, 
  sideBarInit,
  sideBarToggle  
} from "./app.action";


export const initialAppState: AppState = {
  token: null,
  pubKey: null,
  isLoading: false, 
  resetResponse :{
    errorMessage: null,
    isError: false,
    isSuccess: false,
  },
  sideBar: false,  
}

export const AppReducer = createReducer(initialAppState,
   on(sideBarInit, (state: AppState, { isOpen }) => { return { ...state, sideBar: isOpen } }),
  on(sideBarToggle, (state: AppState) => { return { ...state, sideBar: !state.sideBar} }),
   on(loading, (state: AppState, { loading }) => {return {...state, isLoading: loading }}),
  on(resetAccount, (state) => { return { ...state, isLoading: true, resetResponse: { isSuccess: false, errorMessage: null, isError: false } } }),
  on(resetAccountSuccess, (state) => {return { ...state, isLoading: false, resetResponse: { ...state.resetResponse, isSuccess: true }}}),
  on(resetAccountFailed, (state, {error}) =>{  return { ...state, isLoading: false, resetResponse: { ...state.resetResponse, isError: true, errorMessage: error.message } } }),
);
