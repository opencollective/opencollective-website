import expect from 'expect';
import sinon from 'sinon';

import * as constants from '../../../../frontend/src/constants/session';

import logout from '../../../../frontend/src/actions/session/logout';

describe('session/logout', () => {

  beforeEach(() => localStorage.clear());

  it('deletes the access key in localstorage', () => {
    localStorage.setItem('accessToken', 'aaa');
    logout();
    expect(localStorage.getItem('accessToken')).toNotExist();
  });

  it('returns LOGIN_SUCCESS after logout', () => {
    expect(logout()).toEqual({
      type: constants.LOGOUT_SUCCESS
    });
  });

  it('returns LOGOUT_FAILURE if logout fails', () => {
    const stub = sinon.stub(localStorage, 'removeItem', () => {});
    localStorage.setItem('accessToken', 'aaa');

    expect(logout()).toEqual({
      type: constants.LOGOUT_FAILURE
    });

    stub.restore();
  });

});
