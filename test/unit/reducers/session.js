import expect from 'expect';
import reducer from '../../../reducers/session';
import {
  DECODE_JWT_SUCCESS,
  DECODE_JWT_FAILURE,
  DECODE_JWT_EMPTY,
} from '../../../constants/session';

describe('session reducer', () => {

  it('should save the decoded user info', () => {
    const user = {id: 1};

    expect(reducer({}, {
      type: DECODE_JWT_SUCCESS,
      user
    }))
    .toEqual({user, isAuthenticated: true});
  });

  it('should set isAuthenticated to false if it fails', () => {

    expect(reducer({}, {
      type: DECODE_JWT_FAILURE
    }))
    .toEqual({isAuthenticated: false});
  });

  it('should set isAuthenticated to false if it does not have a JWT', () => {

    expect(reducer({}, {
      type: DECODE_JWT_EMPTY
    }))
    .toEqual({isAuthenticated: false});
  });
});
