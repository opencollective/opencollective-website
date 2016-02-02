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

  it('should create a transaction', () => {
    const transactions = {
      1: {amount: 15}
    };
    const state = reducer({}, {
      type: constants.CREATE_TRANSACTION_SUCCESS,
      transactions
    });

    expect(state).toEqual(transactions);
  });

  describe('approve', () => {
    it('should be in progress after an APPROVE_TRANSACTION_REQUEST', () => {
      const state = reducer({}, {
        type: constants.APPROVE_TRANSACTION_REQUEST
      });

      expect(state).toEqual({ approveInProgress: true});
    });

    it('should not be in progress after an APPROVE_TRANSACTION_SUCCESS', () => {
      const state = reducer({ approveInProgress: true }, {
        type: constants.APPROVE_TRANSACTION_SUCCESS
      });

      expect(state).toEqual({ approveInProgress: false});
    });

    it('should not be in progress after an APPROVE_TRANSACTION_FAILURE', () => {
      const state = reducer({ approveInProgress: true }, {
        type: constants.APPROVE_TRANSACTION_FAILURE
      });

      expect(state).toEqual({ approveInProgress: false});
    });
  });

  describe('reject', () => {
    it('should be in progress after an REJECT_TRANSACTION_REQUEST', () => {
      const state = reducer({}, {
        type: constants.REJECT_TRANSACTION_REQUEST
      });

      expect(state).toEqual({ rejectInProgress: true});
    });

    it('should not be in progress after an REJECT_TRANSACTION_SUCCESS', () => {
      const state = reducer({ rejectInProgress: true }, {
        type: constants.REJECT_TRANSACTION_SUCCESS
      });

      expect(state).toEqual({ rejectInProgress: false});
    });

    it('should not be in progress after an REJECT_TRANSACTION_FAILURE', () => {
      const state = reducer({ rejectInProgress: true }, {
        type: constants.REJECT_TRANSACTION_FAILURE
      });

      expect(state).toEqual({ rejectInProgress: false});
    });
  });

  describe('pay', () => {
    it('should be in progress after an PAY_TRANSACTION_REQUEST', () => {
      const state = reducer({}, {
        type: constants.PAY_TRANSACTION_REQUEST
      });

      expect(state).toEqual({ payInProgress: true});
    });

    it('should not be in progress after an PAY_TRANSACTION_SUCCESS', () => {
      const state = reducer({ payInProgress: true }, {
        type: constants.PAY_TRANSACTION_SUCCESS
      });

      expect(state).toEqual({ payInProgress: false});
    });

    it('should not be in progress after an PAY_TRANSACTION_FAILURE', () => {
      const state = reducer({ payInProgress: true }, {
        type: constants.PAY_TRANSACTION_FAILURE
      });

      expect(state).toEqual({ payInProgress: false});
    });
  });

});
