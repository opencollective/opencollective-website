import { createSelector } from 'reselect';

/*
 * Session selectors
 */
const getSessionSelector = (state) => state.session;

export const isSessionAuthenticatedSelector = createSelector(
  getSessionSelector,
  (session) => !!session.isAuthenticated );

export const getAuthenticatedUserSelector = createSelector(
  [ getSessionSelector, isSessionAuthenticatedSelector ],
  (session, isAuthenticated) => isAuthenticated ? session.user : null);