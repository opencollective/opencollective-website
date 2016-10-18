import { createSelector } from 'reselect';

import { getSlugSelector } from './router';
import { getAuthenticatedUserSelector } from './session';

import i18nLib from '../lib/i18n';
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
  getCollectiveHostSelector,
  (host) => host.length === 0 ? false : true);

export const getPopulatedCollectiveSelector = createSelector(
  [ getCollectiveSelector,
    getCollectiveSettingsSelector,
    getCollectiveHostSelector,
    getCollectiveMembersSelector,
    getCollectiveBackersSelector ],
    (collective, settings, host, members, backers) =>
      Object.assign(
        {},
        collective,
        settings,
        { host },
        { members },
        { backers })
    );

/*
 * Other selectors
 */

export const getI18nSelector = createSelector(
  getCollectiveSettingsSelector,
  (settings) => i18nLib(settings.lang || 'en'));

export const canEditCollectiveSelector = createSelector(
  [ getAuthenticatedUserSelector, getCollectiveMembersSelector ],
  (authenticatedUser, members) => !!members.find(u => u.id === authenticatedUser.id));
