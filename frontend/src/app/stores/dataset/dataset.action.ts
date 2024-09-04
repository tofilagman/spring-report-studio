import { createAction, props } from "@ngrx/store";

export const LOAD_DATALIST = "[DATASET] Load Data List";
export const LOAD_DATALIST_SUCCESS = "[DATASET] Load Data List Success";
export const LOAD_DATAINFO = "[DATASET] Load Data Info";
export const LOAD_DATAINFO_SUCCESS = "[DATASET] Load Data Info Success";
export const SAVE_DATAINFO = "[DATASET] Save Data Info";
export const SAVE_DATAINFO_SUCCESS = "[DATASET] Save Data Info Success";
export const DELETE_DATAINFO = "[DATASET] Delete Data Info";
export const DELETE_DATAINFO_SUCCESS = "[DATASET] Delete Data Info Success";
export const DATA_ERROR = "[DATASET] Data Error";
export const BUTTON_ACTION = "[DATASET] Button Action";
export const BUTTON_ACTION_SUCCESS = "[DATASET] Button Action Success";
export const BUTTON_ACTION_FAILED = "[DATASET] Button Action Failed";
export const DOWNLOAD = "[DATASET] Download";
export const LOAD_DATALOOKUP = "[DATASET] Load Data Lookup";
export const LOAD_DATALOOKUP_SUCCESS = "[DATASET] Load Data Lookup Success";
export const DESTROY_LOOKUP = "[DATASET] Destroy Data Lookup";
export const RESET_COUNTER = "[DATASET] Reset Counter";
export const DESTROY_ALL_LOOKUP = "[DATASET] Destroy All Lookup";

export const loadDataList = createAction(LOAD_DATALIST, props<{
  dataSource: string | null,
  skip: number,
  take: number,
  filter: any
}>());

export const loadDataListSuccess = createAction(LOAD_DATALIST_SUCCESS, props<{
  data: Array<any>,
  count: number
}>());

export const loadDataInfo = createAction(LOAD_DATAINFO, props<{
  dataSource: string | null,
  id: number,
  controller?: 'api' | 'public'
}>());

export const loadDataInfoSuccess = createAction(LOAD_DATAINFO_SUCCESS, props<{
  data: any
}>());

export const saveDataInfo = createAction(SAVE_DATAINFO, props<{
  dataSource: string | null,
  data: any,
  options?: any | null
}>());
export const saveDataInfoSuccess = createAction(SAVE_DATAINFO_SUCCESS, props<{ data: any }>());

export const deleteDataInfo = createAction(DELETE_DATAINFO, props<{
  dataSource: string | null,
  id: number
}>());

export const deleteDataInfoSuccess = createAction(DELETE_DATAINFO_SUCCESS);

export const dataError = createAction(DATA_ERROR, props<{ error: any }>());

export const buttonAction =createAction(BUTTON_ACTION, props<{
  name: string,
  method: 'post' | 'get',
  dataSource: string,
  data: any | null,
  notifyChanged: boolean,
  fullPath?: boolean  
}>())
export const buttonActionSuccess = createAction(BUTTON_ACTION_SUCCESS, props<{
  name: string,
  data: any | null,
  notifyChanged: boolean }>());
export const buttonActionFailed = createAction(BUTTON_ACTION_FAILED, props<{ name: string, error: any }>());


export const download =createAction(DOWNLOAD, props<{
  dataSource: string,
  data: any | null
}>())

export const loadDataLookUp = createAction(LOAD_DATALOOKUP, props<{
  name: string,
  controller?: 'api' | 'public' | 'auth',
  dataSource: string,
  filter: any | null
}>());
export const loadDataLookUpSuccess = createAction(LOAD_DATALOOKUP_SUCCESS, props<{
  name: string,
  data: any | null
}>());
export const destroyLookUp = createAction(DESTROY_LOOKUP, props<{name: string}>());
export const destroyAllLookUp = createAction(DESTROY_ALL_LOOKUP);

export const resetCounter = createAction(RESET_COUNTER);
