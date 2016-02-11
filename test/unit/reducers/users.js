import expect from 'expect';
import reducer from '../../../frontend/src/reducers/users';

describe('users reducer', () => {

  it('should return the initial state', () => {
    const state = {1: {}};
    expect(reducer(state, {})).toEqual(state);
  });

});
