import merge from 'lodash/merge';

import Schemas from '../lib/schemas';
import { normalize } from 'normalizr';

import * as constants from '../constants/users';
import {DONATE_GROUP_SUCCESS} from '../constants/groups';
import { HYDRATE } from '../constants/session';

export default function users(state={
  updateInProgress: false,
  sendingEmailInProgress: false,
  connectPaypalInProgress: false,
  connectStripeInProgress: false
}, action={}) {
  const {
    type,
    error,
    users,
    userid,
    cards
  } = action;

  switch (type) {

   case HYDRATE:
    if (action.data.user) {
      return merge({}, state, {
        [action.data.user.id]: action.data.user
      });
    } 
    return state;


    case constants.FETCH_USER_SUCCESS:
    case constants.FETCH_USERS_BY_GROUP_SUCCESS: {
      /*
       * Note: the 'role' and 'createdAt' is stored in groups reducer.
       * Removing them from here so we can merge user data (which comes
       * appended with userGroup data) without conflicts
       */
      const options = {
        assignEntity (obj, key, val) {
          if (key !== 'role' && key !== 'createdAt') {
            obj[key] = val;
          }
        }
      };
      return merge({}, state, normalize(users, Schemas.USER_ARRAY, options).entities.users);
    }
    case constants.REFRESH_LOGIN_TOKEN_REQUEST:
    case constants.SEND_NEW_LOGIN_TOKEN_REQUEST:
      return merge({}, state, { sendingEmailInProgress: true });

     case constants.UPDATE_USER_REQUEST:
      return merge({}, state, { updateInProgress: true });

    case constants.SEND_NEW_LOGIN_TOKEN_SUCCESS:
    case constants.REFRESH_LOGIN_TOKEN_SUCCESS:
      return merge({}, state, { sendingEmailInProgress: false });

    case constants.UPDATE_USER_SUCCESS:
      return merge({}, state, { updateInProgress: false });

    case constants.SEND_NEW_LOGIN_TOKEN_FAILURE:
    case constants.REFRESH_LOGIN_TOKEN_FAILURE:
      return merge({}, state, { sendingEmailInProgress: false, error });

    case constants.UPDATE_USER_FAILURE:
      return merge({}, state, { updateInProgress: false, error });

    case constants.FETCH_USERS_BY_GROUP_FAILURE:
      return merge({}, state, { error });

    case DONATE_GROUP_SUCCESS:
      return merge({}, state, {
        newUser: action.json.user
      });

    case constants.USER_CARDS_SUCCESS:
      return merge({}, state, {
        [userid]: { cards }
      });

    case constants.GET_APPROVAL_KEY_FOR_USER_REQUEST:
      return merge({}, state, { connectPaypalInProgress: true});

    case constants.GET_APPROVAL_KEY_FOR_USER_FAILURE:
      return merge({}, state, {connectPaypalInProgress: false});

    case constants.AUTHORIZE_STRIPE_REQUEST:
      return merge({}, state, { connectStripeInProgress: true});

    case constants.AUTHORIZE_STRIPE_FAILURE:
      return merge({}, state, { connectStripeInProgress: false});
      
    default:
      return state;
  }
}
