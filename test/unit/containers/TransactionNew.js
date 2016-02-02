import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai from 'chai';
import spies from 'chai-spies';
import { createExpense, TransactionNew } from '../../../containers/TransactionNew';
import noop from '../helpers/noop';

const {expect} = chai;
const {
  findRenderedDOMComponentWithClass,
  renderIntoDocument
} = TestUtils;

const createElement = (props) => {
  const rendered = renderIntoDocument(<TransactionNew {...props} />);
  return findRenderedDOMComponentWithClass(rendered, 'TransactionForm');
};

chai.use(spies);

describe('TransactionNew container', () => {

  it('should reset form on mount', () => {
      const handler = chai.spy(noop);
      const transaction = {
        attributes: {},
        error: {}
      };

      createElement({
        transaction,
        tags: [],
        resetNotifications: noop,
        notification: {},
        fetchGroup: noop,
        group: {id: 1, currency: 'USD' },
        appendTransactionForm: handler,
        resetTransactionForm: handler
      });
      expect(handler).to.have.been.called();
  });

  it('should create an expense an invert the sign', (done) => {
    const amount = 10;
    const props = {
      group: {id: 1, currency: 'USD' },
      transaction: {
        attributes: {amount}
      },
      validateTransaction: noop,
      createTransaction
    };

    createExpense.call({props}, {});

    function createTransaction(groupid, transaction) {
      expect(transaction.amount).to.be.equal(-amount);
      done();
      return Promise.resolve();
    }
  });

});
