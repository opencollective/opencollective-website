import { createSelector } from 'reselect';

const getFormSelector = (state) => state.form;

export const getEditCollectiveFormSelector = createSelector(
  getFormSelector,
  (form) => form.editCollective)

export const getEditCollectiveFormAttrSelector = createSelector(
  getEditCollectiveFormSelector,
  (editCollectiveForm) => editCollectiveForm.attributes);

export const getEditCollectiveInProgress = createSelector(
  getEditCollectiveFormSelector,
  (editCollectiveForm) => editCollectiveForm.inProgress);