import keys from 'lodash/object/keys';
import merge from 'lodash/object/merge';
import transactions from '../transactions/fetch_by_group';
import fetchGroups from './fetch_groups';
import * as constants from '../../constants/users';


/**
 * This action doesn't scale well, we will need to add an api route to handle
 * that type of data fetching, we will leave it here for the prototype
 */

export default (userid, options={}) => {
  return dispatch => {
    dispatch(request(userid));

    return dispatch(fetchGroups(userid))
    .then(({groups}) => {
      const ids = keys(groups);
      return Promise.all(ids.map(id => dispatch(transactions(id, options))));
    })
    .then((json) => {
      const merged = merge.apply(null, json) || {};
      return dispatch(success(userid, merged));
    })
    .catch(error => dispatch(failure(error)));
  };
};

function request(userid) {

  return {
    type: constants.USER_TRANSACTIONS_REQUEST,
    userid
  };
}

function success(userid, {transactions}) {
  return {
    type: constants.USER_TRANSACTIONS_SUCCESS,
    userid,
    transactions,
  };
}

function failure(error) {
  return {
    type: constants.USER_TRANSACTIONS_FAILURE,
    error,
  };
}


