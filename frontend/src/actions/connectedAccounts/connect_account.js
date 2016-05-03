import { get } from '../../lib/api';
import * as constants from '../../constants/connected_accounts';

// TODO restrict to host users? How?
export default (service) => {
  return dispatch => {
    dispatch(request());
    return get(`/auth/${service}`)
      .then(json => dispatch(success()))
      .catch(error => dispatch(failure(error)));
  }
};

const request = () => {
  return { type: constants.CONNECT_ACCOUNT_REQUEST };
};

const success = () => {
  return { type: constants.CONNECT_ACCOUNT_SUCCESS };
};

const failure = error => {
  return {
    type: constants.CONNECT_ACCOUNT_FAILURE,
    error
  };
};
