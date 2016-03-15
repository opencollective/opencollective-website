import expect from 'expect';

import * as constants from '../../../../frontend/src/constants/session';
import storeToken from '../../../../frontend/src/actions/session/store_token';

describe('session/store_token', () => {

  beforeEach(() => localStorage.clear());

  it('sets the token in localStorage', () => {
    const token = 'abc';
    const { type } = storeToken(token);

    expect(type).toEqual(constants.STORE_TOKEN_SUCCESS);
    expect(localStorage.getItem('accessToken')).toEqual(token);
  });

  it('returns STORE_TOKEN_FAILURE if no token provided', () => {
    const { type } = storeToken();

    expect(type).toEqual(constants.STORE_TOKEN_FAILURE);
  });

});
