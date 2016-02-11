import expect from 'expect';
import jwt from 'jwt-simple';
import sinon from 'sinon';

import * as constants from '../../../frontend/src/constants/session';

import logout from '../../../frontend/src/actions/session/logout';
import decodeJWT from '../../../frontend/src/actions/session/decode_jwt';

describe('session actions', () => {
  beforeEach(() => {
    localStorage.clear();
  });


  describe('decode JWT', () => {
    it('creates DECODE_JWT_SUCCESS if it decodes a JWT', () => {
      const user = { id: 1 };
      const accessToken = jwt.encode(user, 'aaa');

      localStorage.setItem('accessToken', accessToken);

      expect(decodeJWT()).toEqual({
        type: constants.DECODE_JWT_SUCCESS,
        user
      });
    });

    it('creates DECODE_JWT_FAILURE if it fails to decode a JWT', () => {
      localStorage.setItem('accessToken', 'lol');

      expect(decodeJWT()).toEqual({
        type: constants.DECODE_JWT_FAILURE,
      });
    });

    it('creates DECODE_JWT_FAILURE if the JWT does not contain an id', () => {
      localStorage.setItem('accessToken', jwt.encode({ a: 'b'}, 'aaa'));

      expect(decodeJWT()).toEqual({
        type: constants.DECODE_JWT_FAILURE,
      });
    });

    it('creates DECODE_JWT_EMPTY if the JWT is empty in LocalStorage', () => {
      localStorage.clear();

      expect(decodeJWT()).toEqual({
        type: constants.DECODE_JWT_EMPTY,
      });
    });
  });

  describe('logout', () => {
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

});
