import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import TransactionForm from '../../../components/TransactionForm';

const {
  findRenderedDOMComponentWithClass,
  renderIntoDocument
} = TestUtils;

chai.use(spies);

describe('TransactionForm component', () => {
  const noop = () => {};
  let resetTransactionForm = chai.spy(noop);
  let appendTransactionForm = chai.spy(noop);

  beforeEach(() => {
    const props = {
      transaction: { attributes: {}, error: {} },
      group: { currency: 'USD' },
      tags: ['a', 'b'],
      resetTransactionForm,
      appendTransactionForm,
      resetNotifications: () => {},
      notification: {}
    };

    const rendered = renderIntoDocument(<TransactionForm {...props} />);
    findRenderedDOMComponentWithClass(rendered, 'js-form');
  });

  it('should reset the form on mount', () => {
    expect(resetTransactionForm).to.have.been.called();
  });
});
