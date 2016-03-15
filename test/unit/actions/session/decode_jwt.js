import expect from 'expect';
import jwt from 'jwt-simple';

import * as constants from '../../../../frontend/src/constants/session';
import decodeJWT from '../../../../frontend/src/actions/session/decode_jwt';

describe('session/decode_jwt', () => {

  beforeEach(() => localStorage.clear());

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
