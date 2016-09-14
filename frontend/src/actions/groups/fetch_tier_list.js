import { get } from '../../lib/api';
import * as constants from '../../constants/groups';

/**
 * Fetch one group
 */

export default (groupId, tier) => {
  return dispatch => {
    dispatch(request(groupId, tier));
    return get(`/groups/${groupId}/tiers/${tier}`)
    .then(json => dispatch(success(groupId, tier, json)))
    .catch(error => dispatch(failure(groupId, tier, error)));
  };
};

function request(groupId, tier) {
  return {
    type: constants.GROUP_TIER_LIST_REQUEST,
    groupId, 
    tier
  };
}

export function success(groupId, tier, json) {
  return {
    type: constants.GROUP_TIER_LIST_SUCCESS,
    groupId, 
    tier,
    tierList: json
  };
}

function failure(groupId, tier, error) {
  return {
    type: constants.GROUP_TIER_LIST_FAILURE,
    groupId, 
    tier,
    error
  };
}
