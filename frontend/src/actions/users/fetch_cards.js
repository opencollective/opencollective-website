import { get } from '../../lib/api';
import Schemas from '../../lib/schemas';
import * as constants from '../../constants/users';

/**
 * Fetch all the cards from a user
 */

export default (userid, options={}) => {
  const service = options.service;
  const params = service ? `?filter[service]=${service}` : '';

  return dispatch => {
    dispatch(request(userid));
    return get(`/users/${userid}/cards${params}`, {
        schema: Schemas.CARD_ARRAY,
      })
      .then(json => dispatch(success(userid, json)))
      .catch(err => dispatch(failure(err)));
  };
};

function request(userid) {
  return {
    type: constants.USER_CARDS_REQUEST,
    userid
  };
}

function success(userid, json) {
  return {
    type: constants.USER_CARDS_SUCCESS,
    userid,
    cards: json.cards,
  };
}

function failure(error) {
  return {
    type: constants.USER_CARDS_FAILURE,
    error,
  };
}
