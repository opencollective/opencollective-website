import { createSelector } from 'reselect';
import merge from 'lodash/merge';

import { getSlugSelector } from './router';
import { getAuthenticatedUserSelector } from './session';

import i18nLib from '../lib/i18n';
import filterCollection from '../lib/filter_collection';
import { formatGithubContributors } from '../lib/github';
import { resizeImage } from '../lib/utils'

import { getUnpaidExpensesSelector } from './expenses';
import { 
  getTransactionsSelector,
  getPaidExpensesSelector } from './transactions';

import roles from '../constants/roles';

const DEFAULT_COLLECTIVE_SETTINGS = {
  lang: 'en',
  formatCurrency: {
    compact: false,
    precision: 2
  },
  style: {
    hero: { 
      cover: { 
        backgroundImage: "url('/public/images/collectives/default-header-bg.jpg')"
      }, 
      a: {}
    }
  }
};

/*
 * Collective selectors
 */
const getCollectivesSelector = (state) => state.collectives;

export const getCollectiveSelector = createSelector(
  [ getSlugSelector, getCollectivesSelector ],
  (slug, collectives) => collectives[slug] || { slug });

export const getCollectiveSettingsSelector = createSelector(
  getCollectiveSelector,
  (collective) => {
    const settings = merge({}, DEFAULT_COLLECTIVE_SETTINGS, collective.settings);

    if (collective.backgroundImage) {
      settings.style.hero.cover.backgroundImage = `url(${resizeImage(collective.backgroundImage, { width: 1024 })})`;
    }
    return settings;
  });

export const getSubCollectivesSelector = createSelector(
  [ getCollectiveSelector ],
  (collective) => {

    // Order the collectives by number of backers DESC
    if (collective.superCollectiveData && collective.superCollectiveData.length > 0) {
      collective.superCollectiveData.sort((a,b) => b.backersAndSponsorsCount - a.backersAndSponsorsCount);
    }

    return collective.superCollectiveData;
  }
)

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
  (usersByRole) => usersByRole[roles.HOST] && usersByRole[roles.HOST].length > 0 ? usersByRole[roles.HOST][0] : null);

export const getCollectiveMembersSelector = createSelector(
  getCollectiveUsersByRoleSelector,
  (usersByRole) => usersByRole[roles.MEMBER] || []);

export const getCollectiveBackersSelector = createSelector(
  getCollectiveUsersByRoleSelector,
  (usersByRole) => usersByRole[roles.BACKER] || []);

export const hasHostSelector = createSelector(
  [getCollectiveHostSelector, getStripePublishableKeySelector],
  (host, publishableKey) => host && publishableKey ? true : false);

export const getCollectiveDataSelector = createSelector(
  getCollectiveSelector,
  (collective) => collective.data || {});

export const getCollectiveGithubContributorsSelector = createSelector(
  getCollectiveDataSelector,
  (data) => data.githubContributors ? formatGithubContributors(data.githubContributors) : []);

export const getPopulatedCollectiveSelector = createSelector(
  [ getCollectiveSelector,
    getCollectiveSettingsSelector,
    getCollectiveHostSelector,
    getCollectiveMembersSelector,
    getCollectiveBackersSelector,
    getCollectiveGithubContributorsSelector,
    getUnpaidExpensesSelector,
    getPaidExpensesSelector,
    getTransactionsSelector ],
    (collective, settings, host, members, backers, contributors, unpaidExpenses, paidExpenses, transactions) =>
      Object.assign(
        {},
        collective,
        { settings },
        { host },
        { members },
        { backers },
        { backersCount: backers.length },
        { contributors },
        { contributorsCount: contributors.length },
        { unpaidExpenses: filterCollection(unpaidExpenses, { GroupId: collective.id })},
        { paidExpenses: filterCollection(paidExpenses, { GroupId: collective.id })},
        { transactions: filterCollection(transactions, {GroupId: collective.id })},
    ));

/*
 * Other selectors
 */

export const getI18nSelector = createSelector(
  getCollectiveSettingsSelector,
  (settings) => i18nLib(settings.lang || 'en'));

export const isHostOfCollectiveSelector = createSelector(
  [ getAuthenticatedUserSelector, getCollectiveHostSelector ],
  (authenticatedUser, host) => host && authenticatedUser && authenticatedUser.id === host.id);

export const canEditCollectiveSelector = createSelector(
  [ getAuthenticatedUserSelector, getCollectiveMembersSelector, isHostOfCollectiveSelector ],
  (authenticatedUser, members, isHost) => isHost || (authenticatedUser && !!members.find(u => u.id === authenticatedUser.id)));

