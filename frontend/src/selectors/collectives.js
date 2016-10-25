import { createSelector } from 'reselect';

import { getSlugSelector } from './router';
import { getAuthenticatedUserSelector } from './session';

import i18nLib from '../lib/i18n';
import filterCollection from '../lib/filter_collection';
import { formatGithubContributors } from '../lib/github';

import { getExpensesSelector } from './expenses';
import { getTransactionsSelector } from './transactions';

import roles from '../constants/roles';

const DEFAULT_COLLECTIVE_SETTINGS = {
  lang: 'en',
  formatCurrency: {
    compact: false,
    precision: 2
  }
};

/*
 * Collective selectors
 */
const getCollectivesSelector = (state) => state.collectives;

export const getCollectiveSelector = createSelector(
  [ getSlugSelector, getCollectivesSelector ],
  (slug, collectives) => collectives[slug]);

export const getCollectiveSettingsSelector = createSelector(
  getCollectiveSelector,
  (collective) => collective.settings || DEFAULT_COLLECTIVE_SETTINGS);

export const getStripeAccountSelector = createSelector(
  getCollectiveSelector,
  (collective) => collective.stripeAccount || {});

export const getStripePublishableKeySelector = createSelector(
  getStripeAccountSelector,
  (stripeAccount) => stripeAccount.stripePublishableKey);

const getCollectiveUsersByRoleSelector = createSelector(
  getCollectiveSelector,
  (collective) => collective.usersByRole || {});

export const getCollectiveHostSelector = createSelector(
  getCollectiveUsersByRoleSelector,
  (usersByRole) => usersByRole[roles.HOST] || []);

export const getCollectiveMembersSelector = createSelector(
  getCollectiveUsersByRoleSelector,
  (usersByRole) => usersByRole[roles.MEMBER] || []);

export const getCollectiveBackersSelector = createSelector(
  getCollectiveUsersByRoleSelector,
  (usersByRole) => usersByRole[roles.BACKER] || []);

export const hasHostSelector = createSelector(
  [getCollectiveHostSelector, getStripePublishableKeySelector],
  (host, publishableKey) => host.length === 1 && publishableKey ? true : false);

export const getCollectiveDataSelector = createSelector(
  getCollectiveSelector,
  (collective) => collective.data || {});

export const getCollectiveContributorsSelector = createSelector(
  getCollectiveDataSelector,
  (data) => data.githubContributors ? formatGithubContributors(data.githubContributors) : []);

export const getPopulatedCollectiveSelector = createSelector(
  [ getCollectiveSelector,
    getCollectiveSettingsSelector,
    getCollectiveHostSelector,
    getCollectiveMembersSelector,
    getCollectiveBackersSelector,
    getCollectiveContributorsSelector,
    getExpensesSelector,
    getTransactionsSelector ],
    (collective, settings, host, members, backers, contributors, expenses, transactions) =>
      Object.assign(
        {},
        collective,
        settings,
        { host },
        { members },
        { backers },
        { backersCount: backers.length },
        { contributors },
        { contributorsCount: contributors.length },
        { expenses: filterCollection(expenses, { GroupId: collective.id })},
        { transactions: filterCollection(transactions, {GroupId: collective.id })},
    ));

/*
 * Other selectors
 */

export const getI18nSelector = createSelector(
  getCollectiveSettingsSelector,
  (settings) => i18nLib(settings.lang || 'en'));

export const canEditCollectiveSelector = createSelector(
  [ getAuthenticatedUserSelector, getCollectiveMembersSelector ],
  (authenticatedUser, members) => !!members.find(u => u.id === authenticatedUser.id));
