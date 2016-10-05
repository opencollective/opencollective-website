import merge from 'lodash/merge';
import * as constants from '../constants/donations';

export default function donations(state={}, action={}) {
  switch (action.type) {
    case constants.DONATIONS_SUCCESS:
    case constants.DONATION_SUCCESS: {
      const {donations} = action;
      return merge({}, state, donations);
    }
    default:
      return state;
  }
}