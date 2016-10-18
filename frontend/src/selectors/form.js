import { createSelector } from 'reselect';

const getFormSelector = (state) => state.form;

export const getEditCollectiveFormSelector = createSelector(
  getFormSelector,
  (form) => form.editCollective)