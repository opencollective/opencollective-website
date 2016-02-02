import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai from 'chai';
import spies from 'chai-spies';

import noop from '../helpers/noop';

import { AddFund, donate } from '../../../containers/AddFund';

const { expect } = chai;
const {
  findRenderedDOMComponentWithClass,
  renderIntoDocument
} = TestUtils;

const createElement = (props) => {
  const rendered = renderIntoDocument(<AddFund {...props} />);
  return findRenderedDOMComponentWithClass(rendered, 'AddFund');
};

chai.use(spies);

describe('AddFund container', () => {

  it('should fetch user and group on mount', () => {
    const fetchGroup = chai.spy(noop);
    const fetchCards = chai.spy(noop);

    createElement({
      fetchGroup,
      fetchCards,
      userCardsLabels: [],
      resetNotifications: noop,
      notification: {},
      group: {},
      form: { donation: {} },
      user: {}
    });

    expect(fetchCards).to.have.been.called();
    expect(fetchGroup).to.have.been.called();
  });

  it('should have a default description for the donation', (done) => {
    const description = 'Initial budget';
    const amount = 10;

    const validateTransaction = (transaction) => {
      expect(transaction.description).to.be.equal(description);
      expect(transaction.amount).to.be.equal(amount);
      expect(transaction.tags[0]).to.be.equal('Fund');
      expect(transaction.approved).to.be.ok;
      expect(transaction.approvedAt).to.be.ok;
      return Promise.resolve(done());
    }

    donate.apply({
      props: {
        validateTransaction,
        groupid: 1,
        form: { donation: {} },
        group: {},
        user: {},
      },
      state: {
        amount,
        description
      }
    }).then(done);
  });

  it('should redirect to GroupTransactions page if successful', (done) => {
    const pushState = (ctx, url) => {
      expect(url).to.be.equal(`/app/groups/1/transactions`);
      done();
    }

    donate.apply({
      props: {
        validateTransaction: noop,
        createTransaction: noop,
        pushState,
        groupid: 1,
        amount: 1,
        group: {},
        user: {},
      },
      state: {}
    });
  });
});
