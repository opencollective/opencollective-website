import { createSelector } from 'reselect';

/*
 * Session selectors
 */
export const getSessionSelector = (state) => state.session;

export const isSessionAuthenticatedSelector = createSelector(
  getSessionSelector,
  (session) => !!session.isAuthenticated );

export const getAuthenticatedUserSelector = createSelector(
  [ getSessionSelector, isSessionAuthenticatedSelector ],
  (session, isAuthenticated) => isAuthenticated ? session.user : null);