import { createSelector } from 'reselect';

import i18nLib from '../lib/i18n';
import { canEditGroup } from '../lib/admin';

const DEFAULT_COLLECTIVE_SETTINGS = {
  lang: 'en',
  formatCurrency: {
    compact: false,
    precision: 2
  }
};

const getRouterSelector = (state) => state.router;
const getCollectivesSelector = (state) => state.collectives;
const getSessionSelector = (state) => state.session;

const getParamsSelector = createSelector(
  getRouterSelector,
  (router) => router.params || {});

export const getSlugSelector = createSelector(
  getParamsSelector,
  (params) => params.slug ? params.slug.toLowerCase() : '');

export const getCollectiveSelector = createSelector(
  [ getSlugSelector, getCollectivesSelector ],
  (slug, collectives) => collectives[slug]);

export const getCollectiveSettingsSelector = createSelector(
  getCollectiveSelector,
  (collective) => collective.settings || DEFAULT_COLLECTIVE_SETTINGS);

export const getI18nSelector = createSelector(
  getCollectiveSettingsSelector,
  (settings) => i18nLib(settings.lang || 'en'));

export const canEditGroupSelector = createSelector(
  [ getSessionSelector, getCollectiveSelector ],
  (session, collective) => canEditGroup(session, collective));
