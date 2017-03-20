import { createSelector } from 'reselect';
import findKey from 'lodash/findKey';

import { getSlugSelector } from './router';
import { getAuthenticatedUserSelector } from './session';

export const getUsersSelector = (state) => state.users;

export const getNewUserSelector = createSelector(
  getUsersSelector,
  (users) => users.newUser || {});

/*
 * Gets the user currently referenced by the slug in the url
 * If not found, returns null;
 * Useful for determining whether current slug is a user profile or collective
 */
export const getCurrentUserProfileSelector = createSelector(
  [getSlugSelector, getUsersSelector],
  (slug, users) => {
    const userId = findKey(users, u => u.username === slug);
    return userId ? users[userId] : null;
  });

export const getLoggedInUserProfileSelector = createSelector(
  [getUsersSelector, getAuthenticatedUserSelector],
  (users, authenticatedUser) => {
    if (authenticatedUser && users[authenticatedUser.id]) {
      return users[authenticatedUser.id]
    } else if (authenticatedUser) {
      return authenticatedUser;
    } else {
      return null;
    }
  });

export const getUpdateInProgressSelector = createSelector(
  getUsersSelector,
  (users) => users.updateInProgress);

export const getCardsForAuthenticatedUserSelector = createSelector(
  [ getUsersSelector, getAuthenticatedUserSelector],
  (users, authenticatedUser) => {
    if (authenticatedUser && users[authenticatedUser.id]) {
      return users[authenticatedUser.id].cards;
    } else {
      return null;
    }
  })

export const getPaypalCardSelector = createSelector(
  getCardsForAuthenticatedUserSelector,
  (cards) => {
    let paypalCard = null;
    if (cards) {
      Object.keys(cards).forEach((key) => {
        if (cards[key].service === 'paypal') {
          paypalCard = cards[key];
        }
      });
    }
    return paypalCard;
  });

export const getConnectPaypalInProgressSelector = createSelector(
  getUsersSelector,
  (users) => users.connectPaypalInProgress);

export const getStripeAccountSelector = createSelector(
  getCurrentUserProfileSelector,
  user => user.stripeAccount);

export const getConnectStripeInProgressSelector = createSelector(
  getUsersSelector,
  (users) => users.connectStripeInProgress);