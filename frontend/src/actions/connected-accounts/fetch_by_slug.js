import { get } from '../../lib/api';
import * as constants from '../../constants/connected_accounts';

/**
 * Fetch connected accounts
 */

export default (slug, params={}) => {
  return dispatch => {
    dispatch(request(slug));
    return get(`/${slug.toLowerCase()}/connected-accounts`, { params })
    .then(json => dispatch(success(slug, json)))
    .catch(error => dispatch(failure(error)));
  };
};

function request(slug) {
  return {
    type: constants.CONNECTED_ACCOUNTS_REQUEST,
    slug
  };
}

export function success(slug, json) {
  return {
    type: constants.CONNECTED_ACCOUNTS_SUCCESS,
    slug,
    connectedAccounts: json.connectedAccounts
  };
}

function failure(error) {
  return {
    type: constants.CONNECTED_ACCOUNTS_FAILURE,
    error,
  };
}
