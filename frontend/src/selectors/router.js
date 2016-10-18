import { createSelector } from 'reselect';

/*
 * Router selectors
 */
const getRouterSelector = (state) => state.router;

const getParamsSelector = createSelector(
  getRouterSelector,
  (router) => router.params || {});

export const getSlugSelector = createSelector(
  getParamsSelector,
  (params) => params.slug ? params.slug.toLowerCase() : '');