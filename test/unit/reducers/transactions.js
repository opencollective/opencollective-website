import expect from 'expect';
import reducer from '../../../reducers/transactions';
import * as constants from '../../../constants/transactions';

describe('transactions reducer', () => {

  it('should return the initial state', () => {
    const state = {1: {amount: 10}};
    expect(reducer(state, {})).toEqual(state);
  });

  it('should add one transactions', () => {
    const transactions = {
      2: {amount: 12}
    };
    const state = reducer({}, {
      type: constants.TRANSACTION_SUCCESS,
      transactions
    });

    expect(state).toEqual(transactions);
  });

  it('should add multiple transactions', () => {
    const transactions = {
      2: {amount: 12},
      3: {amount: 15}
    };
    const state = reducer({}, {
      type: constants.TRANSACTIONS_SUCCESS,
      transactions
    });

    expect(state).toEqual(transactions);
  });

});
