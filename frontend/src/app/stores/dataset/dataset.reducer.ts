import { createReducer, on } from "@ngrx/store";
import { DataState } from "./dataset.state";
import {
  buttonActionSuccess, dataError,
  deleteDataInfoSuccess, destroyAllLookUp, destroyLookUp,
  loadDataInfo,
  loadDataInfoSuccess,
  loadDataList,
  loadDataListSuccess,
  loadDataLookUpSuccess, resetCounter,
  saveDataInfoSuccess
} from "./dataset.action";
import { state } from "@angular/animations";


export const initialDataState: DataState = {
  dataList: {
    data: [],
    count: 0
  },
  dataInfo: {
    id: 0,
    data: null
  },
  dataLookUp: [],
  actionCounter: 0,
  error: null
}

export const DataReducer = createReducer(
  initialDataState,
  on(loadDataListSuccess, (state: DataState, { data, count }) => {
    return { ...state, dataList: { data: data, count: count } }
  }),
  //on(loadDataInfo, (state: DataState) => { return { ...state, isLoading: true } }),
  on(loadDataInfoSuccess, (state: DataState, { data }) => {
    return { ...state, dataInfo: { ...state.dataInfo, data: data } }
  }),
  //on(saveDataInfo, (state: DataState) => { return { ...state, isLoading: true } }),
  on(saveDataInfoSuccess, (state: DataState, { data }) => {
    return { ...state, dataInfo: { id: data.id, data: data } }
  }),
  //on(deleteDataInfo, (state: DataState) => { return { ...state, isLoading: true } }),
  on(deleteDataInfoSuccess, (state: DataState) => {
    return { ...state, dataInfo: { id: 0, data: null }, actionCounter: state.actionCounter + 1 }
  }),
  on(buttonActionSuccess, (state: DataState, { data, name, notifyChanged }) => {
    return {
      ...state,
      dataLookUp: upsertArray(state.dataLookUp, x => x.name === name, { name: name, data: data }),
      actionCounter: notifyChangedHandler(state.actionCounter, notifyChanged)
    }
  }),
  on(loadDataLookUpSuccess, (state: DataState, { data, name }) => {
    return {
      ...state,
      dataLookUp: upsertArray(state.dataLookUp, x => x.name === name, { name: name, data: data })
    }
  }),
  on(destroyLookUp, (state: DataState, { name }) => {
    return { ...state, dataLookUp: removeArray(state.dataLookUp, x => x.name === name) }
  }),
  on(destroyAllLookUp, (state: DataState) => {
    return { ...state, dataLookUp: removeArray(state.dataLookUp, x => ['login_props'].indexOf(x.name) === -1), error: null }
  }),
  on(dataError, (state: DataState, { error }) => { return { ...state, error: error } }), //remove action counter here as it loops loading when request failed
  on(resetCounter, (state: DataState) => { return { ...state, actionCounter: 0 } })
)

const notifyChangedHandler = (counter: number, notify: boolean) => {
  if (!notify)
    return counter;
  return counter + 1;
}

const upsertArray = <T>(arr: Array<T>, filter: (f: T) => boolean, data: T): Array<T> => {
  const newArray = [...arr];

  const item = newArray.findIndex(filter);
  if (item > -1) {
    newArray[item] = data;
  } else {
    newArray.push(data);
  }

  return newArray;
}

const removeArray = <T>(arr: Array<T>, filter: (f: T) => boolean): Array<T> => {
  var newArray = [...arr];

  for (var i = newArray.length - 1; i >= 0; i--) {
    if (filter(newArray[i]) === true)
      newArray.splice(i, 1);
  }

  return newArray;
}
