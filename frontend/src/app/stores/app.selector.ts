import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AppState} from './app.state';

export const selectAppState = createFeatureSelector<AppState>('appState');

export const selectLoading = createSelector(selectAppState, (state) => state.isLoading);
export const selectToken = createSelector(selectAppState, (state) => state.token); 
export const selectSideBar = createSelector(selectAppState, (state) => state.sideBar); 
export const selectResetResponse = createSelector(selectAppState, (state) => state.resetResponse);
 

