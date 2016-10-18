import merge from 'lodash/merge';
import { fromJS } from 'immutable';

import { HYDRATE } from '../constants/session';

const DEFAULT_COLLECTIVE_SETTINGS = {
  lang: 'en',
  formatCurrency: {
    compact: false,
    precision: 2
  }
};

const initialState = {} //fromJS({});

export default function collectives(state = initialState, action={}) {
  switch (action.type) {

    case HYDRATE:
      if (action.data.collective) {
        return merge({}, state, {
          [action.data.collective.slug]: merge({}, {settings: DEFAULT_COLLECTIVE_SETTINGS}, action.data.collective)
        });
        /*
        return state
          .set(action.data.collective.slug, action.data.collective)
          //.updateIn([action.data.collective.slug, 'settings'], action.data.collective.settings || DEFAULT_COLLECTIVE_SETTINGS)
          //.updateIn([action.data.collective.slug, 'settings', 'lang'], action.data.collective.settings.lang || 'en');
        */
      }
      return state;

    default:
      return state;
  }
}

