import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai from 'chai';
import spies from 'chai-spies';
import { update, TransactionEdit } from '../../../containers/TransactionEdit';

const {expect} = chai;
const {
  findRenderedDOMComponentWithClass,
  renderIntoDocument
} = TestUtils;

import noop from '../helpers/noop';

const createElement = (props) => {
  const rendered = renderIntoDocument(<TransactionEdit {...props} />);
  return findRenderedDOMComponentWithClass(rendered, 'TransactionForm');
};

chai.use(spies);

describe('TransactionEdit container', () => {

  it('should reset form on mount', () => {
    const resetTransactionForm = chai.spy(noop);

    const transaction = {
      attributes: {},
      error: {}
    };

    createElement({
      initialTransaction: { amount: 10 },
      transaction,
      tags: [],
      resetNotifications: noop,
      fetchTransaction: noop,
      notification: {},
      fetchGroup: noop,
      group: {id: 1, currency: 'USD' },
      appendTransactionForm: noop,
      resetTransactionForm
    });

    expect(resetTransactionForm).to.have.been.called();
  });

  it('should invert the amount sign on update', () => {
    const amount = 10;
    const validateTransaction = chai.spy((transaction) => {
      expect(transaction.amount).to.be.equal(-amount);
      return Promise.resolve();
    });

    const props = {
      validateTransaction,
      updateTransaction: noop,
      notify: noop
    };

    update.call({ props }, {
      attributes: { amount }
    });

  });

});
