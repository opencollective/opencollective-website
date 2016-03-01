import merge from 'lodash/object/merge';
import * as constants from '../constants/session';

export default function session(state={
  user: {},
  isAuthenticated: false
}, action={
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
      return merge({}, state, {
        isAuthenticated: false
      });

    case constants.SHOW_POPOVERMENU:
      return merge({}, state, { hasPopOverMenuOpen: action.hasPopOverMenuOpen });

    case constants.HYDRATE:
      return merge({}, state, { jwtExpired: action.data.jwtExpired });

    default:
      return state;
  }
}

