import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai from 'chai';
import spies from 'chai-spies';
import roles from '../../../constants/roles';
import noop from '../helpers/noop';

import {
  GroupsList,
  mapStateToProps
} from '../../../containers/GroupsList';

const { expect } = chai;
const {
  findRenderedDOMComponentWithClass,
  renderIntoDocument
} = TestUtils;

const createElement = (props, className = 'GroupsList') => {
  const rendered = renderIntoDocument(<GroupsList {...props} />);
  return findRenderedDOMComponentWithClass(rendered, className);
};

chai.use(spies);

describe('GroupsList container', () => {

  it('fetches user, transactions and cards on mount', () => {
    const fetchUserGroupsAndTransactions = chai.spy(noop);
    const fetchCards = chai.spy(noop);

    createElement({
      userid: 1,
      fetchUserGroupsAndTransactions,
      fetchCards,
      fetchUser: noop,
      groups: [],
      query: {},
      resetNotifications: noop,
      notification: {}
    });

    expect(fetchUserGroupsAndTransactions).to.have.been.called();
  });

  it('confirms the card if it has the preapproval key', () => {
    const query = {
      preapprovalKey: 'abc',
      approvalStatus: 'success'
    };

    const confirmPreapprovalKey = chai.spy((userid, preapprovalKey) => {
      expect(userid).to.be.equal(1);
      expect(preapprovalKey).to.be.equal(query.preapprovalKey);
      return Promise.resolve();
    });

    createElement({
      userid: 1,
      fetchUserGroupsAndTransactions: noop,
      fetchCards: noop,
      confirmPreapprovalKey,
      fetchUser: noop,
      resetNotifications: noop,
      notification: {},
      groups: [],
      query
    });

    expect(confirmPreapprovalKey).to.have.been.called();
  });


  it('shows the paypal reminder if showPaypalReminder is true', () => {
    const query = {
      preapprovalKey: 'abc',
      approvalStatus: 'success'
    };
    const element = createElement({
      userid: 1,
      fetchUserGroupsAndTransactions: noop,
      fetchCards: noop,
      confirmPreapprovalKey: noop,
      getPreapprovalKeyForUser: noop,
      fetchUser: noop,
      resetNotifications: noop,
      notification: {},
      groups: [],
      showPaypalReminder: true,
      query
    }, 'Reminder');

    expect(element.innerHTML).to.contain('success');
  });


  it('shows the profile paypal reminder if showProfileReminder is true', () => {
    const query = {
      preapprovalKey: 'abc',
      approvalStatus: 'success'
    };
    const element = createElement({
      userid: 1,
      fetchUserGroupsAndTransactions: noop,
      fetchCards: noop,
      confirmPreapprovalKey: noop,
      fetchUser: noop,
      getPreapprovalKeyForUser: noop,
      resetNotifications: noop,
      notification: {},
      groups: [],
      showProfileReminder: true,
      query
    }, 'Reminder');

    expect(element.innerHTML).to.contain('profile page');
  });

  it('shows the stripe reminder if showStripeReminder is true', () => {
    const element = createElement({
      userid: 1,
      fetchUserGroupsAndTransactions: noop,
      fetchCards: noop,
      confirmPreapprovalKey: noop,
      getPreapprovalKeyForUser: noop,
      fetchUser: noop,
      resetNotifications: noop,
      notification: {},
      groups: [],
      showStripeReminder: true,
      query: {}
    }, 'Reminder');

    expect(element.innerHTML).to.contain('Please connect your Stripe account to receive donations');
  });


  it('sets userIsHost to true if user is host in group', () => {
    const users = {
      1: {
        groups: { 1: { role: roles.HOST} },
        transactions: {}
      }
    };
    const state = mapStateToProps({
      users,
      session: { user: { id: 1 }},
      router: { location: { query: {} } }
    });

    expect(state.userIsHost).to.be.equal(true);
  });

  it('sets userIsHost to false if user is not host in group', () => {
    const users = {
      1: {
        groups: { 1: { role: roles.BACKER} },
        transactions: {}
      }
    };
    const state = mapStateToProps({
      users,
      session: { user: { id: 1 }},
      router: { location: { query: {} } }
    });

    expect(state.userIsHost).to.be.equal(false);
  });

  it('sets hasConfirmedCards to true if user has confirmed cards', () => {
    const users = {
      1: {
        cards: { 1: { confirmedAt: Date.now() } },
        groups: {},
        transactions: {}
      }
    };
    const state = mapStateToProps({
      users,
      session: { user: { id: 1 }},
      router: { location: { query: {} } }
    });

    expect(state.hasConfirmedCards).to.be.equal(true);
  });

  it('sets hasConfirmedCards to false if user has no confirmed cards', () => {
    const users = {
      1: {
        cards: { 1: { } },
        groups: {},
        transactions: {}
      }
    };
    const state = mapStateToProps({
      users,
      session: { user: { id: 1 }},
      router: { location: { query: {} } }
    });

    expect(state.hasConfirmedCards).to.be.equal(false);
  });

  it('sets showPaypalReminder to true if user has no confirmed cards and is not host', () => {
    const users = {
      1: {
        cards: {},
        groups: { 1: { role: roles.HOST} },
        transactions: {}
      }
    };
    const state = mapStateToProps({
      users,
      session: { user: { id: 1 }},
      router: { location: { query: {} } }
    });

    expect(state.showPaypalReminder).to.be.equal(true);
    expect(state.showProfileReminder).to.be.equal(false);
  });

  it('sets showProfileReminder to false if is not host and has no paypal email', () => {
    const users = {
      1: {
        cards: {},
        groups: { 1: { role: roles.BACKER} },
        transactions: {}
      }
    };
    const state = mapStateToProps({
      users,
      session: { user: { id: 1 }},
      router: { location: { query: {} } }
    });

    expect(state.showProfileReminder).to.be.equal(true);
    expect(state.showPaypalReminder).to.be.equal(false);
  });

  it('sets showStripeReminder to false if is not host', () => {
    const users = {
      1: {
        cards: {},
        groups: { 1: { role: roles.BACKER} },
        transactions: {}
      }
    };
    const state = mapStateToProps({
      users,
      session: { user: { id: 1 }},
      router: { location: { query: {} } }
    });

    expect(state.showStripeReminder).to.be.equal(false);
  });

  it('sets showStripeReminder to true if it is a host and doesn\'t have a stripe account', () => {
    const users = {
      1: {
        cards: {},
        groups: { 1: { role: roles.HOST} },
        transactions: {}
      }
    };
    const state = mapStateToProps({
      users,
      session: { user: { id: 1 }},
      router: { location: { query: {} } }
    });

    expect(state.showStripeReminder).to.be.equal(true);
  });
});
