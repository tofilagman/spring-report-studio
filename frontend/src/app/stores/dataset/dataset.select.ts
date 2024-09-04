import { createFeatureSelector, createSelector } from "@ngrx/store";
import { DataState } from "./dataset.state";

export const selectDataState = createFeatureSelector<DataState>('dataState');

export const selectDataList = createSelector(selectDataState, state => state.dataList);

export const selectDataInfoId = createSelector(selectDataState, state => state.dataInfo.id);
export const selectDataInfo = createSelector(selectDataState, state => state.dataInfo.data);
export const selectActionCounter = createSelector(selectDataState, state => state.actionCounter);
export const selectError = createSelector(selectDataState, state => state.error);
export const selectDataLookUp = (name: string) => createSelector(selectDataState, state => state.dataLookUp.find(x => x.name === name)?.data || []);
