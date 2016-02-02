import expect from 'expect';
import nock from 'nock';
import jwt from 'jwt-simple';
import sinon from 'sinon';

import env from '../../../lib/env';
import mockStore from '../helpers/mockStore';
import * as constants from '../../../constants/session';

import login from '../../../actions/session/login';
import logout from '../../../actions/session/logout';
import decodeJWT from '../../../actions/session/decode_jwt';
import showPopOverMenu from '../../../actions/session/show_popovermenu';

describe('session actions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('login', () => {
     it('creates LOGIN_SUCCESS if it successfully logs in', (done) => {
      const email = 'test@gmail.com';
      const user = { id: 1, email };
      const accessToken = jwt.encode(user, 'aaa');
      const refreshToken = '123';
      const response = {
        access_token: accessToken,
        refresh_token: refreshToken
      };

      nock(env.API_ROOT)
        .post('/authenticate')
        .reply(200, response);

      const expected = [
        { type: constants.LOGIN_REQUEST, email },
        { type: constants.LOGIN_SUCCESS, json: response },
        { type: constants.DECODE_JWT_SUCCESS, user }
      ];
      const store = mockStore({}, expected, done);
      store.dispatch(login({email}));

    });

    it('creates LOGIN_FAILURE if it fails to log in', (done) => {
      const email = 'test@gmail.com';

      nock(env.API_ROOT)
        .post('/authenticate')
        .replyWithError('Wrong stuff');

        const expected = [
          { type: constants.LOGIN_REQUEST, email },
          { type: constants.LOGIN_FAILURE, error: new Error('request to http://localhost:3000/api/authenticate failed') }
        ];
        const store = mockStore({}, expected, done);
        store.dispatch(login({email}));
    });
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

  describe('show popovermenu', () => {
    it('should set the hasPopOverMenuOpen variable ', () => {
      expect(showPopOverMenu(false)).toEqual({
        type: constants.SHOW_POPOVERMENU,
        hasPopOverMenuOpen: false
      });

      expect(showPopOverMenu(true)).toEqual({
        type: constants.SHOW_POPOVERMENU,
        hasPopOverMenuOpen: true
      });
    });
  });

});
