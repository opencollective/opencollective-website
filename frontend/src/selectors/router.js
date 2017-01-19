import { createSelector } from 'reselect';

/*
 * Router selectors
 */
const getRouterSelector = (state) => state.router;

export const getParamsSelector = createSelector(
  getRouterSelector,
  (router) => router.params || {});

export const getLocationSelector = createSelector(
	getRouterSelector,
	(router) => router.location || {});

export const getPathnameSelector = createSelector(
	getLocationSelector,
	(location) => location.pathname || '');

export const getSlugSelector = createSelector(
  getParamsSelector,
  (params) => params.slug ? params.slug.toLowerCase() : '');

export const getQuerySelector = createSelector(
  getLocationSelector,
  (location) => location.query);

export const getTierSelector = createSelector(
  getParamsSelector,
  (params) => {

  let { interval = 'one-time', description } = params;
  if (interval.match(/^month(ly)?$/i)) {
    interval = 'month';
  } else if (interval.match(/^year(ly)?$/i)) {
    interval = 'year';
  } else if (interval !== 'one-time') {
    description = interval;
    interval = 'one-time';
  }

  return {
    amount: params.amount,
    interval,
    description
  }

  }
)