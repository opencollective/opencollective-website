import { createSelector } from 'reselect';

const getAppSelector = (state) => state.app;

export const getAppRenderedSelector = createSelector(
  getAppSelector,
  (app) => app.rendered || false);