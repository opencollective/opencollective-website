import merge from 'lodash/merge';
import * as constants from '../constants/session';

const defaultState = {
  user: {},
  isAuthenticated: false
};

export default function session(state=defaultState, action={
  hasPopOverMenuOpen: false
}) {
  switch (action.type) {

    case constants.DECODE_JWT_SUCCESS:
      return merge({}, state, {
        user: action.user,
        isAuthenticated: true
      });

    case constants.DECODE_JWT_FAILURE:
    case constants.DECODE_JWT_EMPTY:
      return merge({}, defaultState);

    case constants.HYDRATE:
      return merge({}, state, {
        jwtExpired: action.data.jwtExpired,
        jwtInvalid: action.data.jwtInvalid
      });

    default:
      return state;
  }
}

