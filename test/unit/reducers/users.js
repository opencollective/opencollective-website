import expect from 'expect';
import reducer from '../../../reducers/users';
import * as constants from '../../../constants/users';

describe('users reducer', () => {

  it('should return the initial state', () => {
    const state = {1: {}};
    expect(reducer(state, {})).toEqual(state);
  });

  it('should add the groups to the user', () => {
    const groups = {
      1: {name: 'New York'}
    };
    const userid = 1;
    const state = reducer(undefined, {
      type: constants.USER_GROUPS_SUCCESS,
      groups,
      userid
    });

    expect(state).toEqual({
      [userid]: {groups},
      updateInProgress: false,
      cards: []
    });
  });

  it('should add the transactions to the user', () => {
    const transactions = {
      1: {amount: 10}
    };
    const userid = 1;
    const state = reducer(undefined, {
      type: constants.USER_TRANSACTIONS_SUCCESS,
      transactions,
      userid
    });

    expect(state).toEqual({
      [userid]: {transactions},
      updateInProgress: false,
      cards: []
    });
  });

  it('should add new users', () => {
    const users = {
      1: {name: 'bob'},
      updateInProgress: false,
      cards: []
    };
    const state = reducer(undefined, {
      type: constants.FETCH_USER_SUCCESS,
      users
    });

    expect(state).toEqual(users);
  });
});
