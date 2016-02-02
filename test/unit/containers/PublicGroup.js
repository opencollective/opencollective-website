import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai from 'chai';
import spies from 'chai-spies';
import noop from '../helpers/noop';

import {
  PublicGroup,
  donateToGroup,
} from '../../../containers/PublicGroup';

import {
  save
} from '../../../components/PublicGroupSignup';

const {expect} = chai;
const {
  findRenderedDOMComponentWithClass,
  renderIntoDocument
} = TestUtils;

const createElement = (props, className='PublicGroup') => {
  const rendered = renderIntoDocument(<PublicGroup {...props} />);
  return findRenderedDOMComponentWithClass(rendered, className);
};

chai.use(spies);

describe('PublicGroup container', () => {

  it('should fetch the group on mount', () => {
      const handler = chai.spy(noop);
      createElement({
        fetchGroup: handler,
        groupid: 1,
        resetNotifications: noop,
        fetchTransactions: noop,
        fetchUsers: noop,
        notification: {},
        group: {},
        host: {},
        expenses: [],
        donations: [],
        frequency: 'one-time'
      });
      expect(handler).to.have.been.called();
  });

  it('should donate to the group', (done) => {
    const notify = chai.spy(noop);
    const showAdditionalUserInfoForm = chai.spy(noop);
    const token = {
      id: 'tok_17BNlt2eZvKYlo2CVoTcWs9D',
      email: 'test@gmail.com'
    };
    const donate = chai.spy((groupid, payment) => {
      expect(groupid).to.be.equal(1);
      expect(payment.currency).to.be.equal('MXN');
      expect(payment.email).to.be.equal(token.email);
      expect(payment.amount).to.be.equal(10);

      return Promise.resolve();
    });

    const props = {
      groupid: 1,
      donate,
      group: {
        currency: 'MXN'
      },
      notify,
      showAdditionalUserInfoForm,
      fetchGroup: noop,
      fetchTransactions: noop
    };

    donateToGroup.call({props}, 10, token)
    .then(() => {
      expect(donate).to.have.been.called();
      expect(notify).to.not.have.been.called();
      expect(showAdditionalUserInfoForm).to.have.been.called();
      done();
    });
  });

  it('should donate with subscription to the group', (done) => {
    const token = {
      id: 'tok_17BNlt2eZvKYlo2CVoTcWs9D',
      email: 'test@gmail.com'
    };
    const donate = chai.spy((groupid, payment) => {
      expect(groupid).to.be.equal(1);
      expect(payment.interval).to.be.equal('month');
      expect(payment.stripeToken).to.be.equal(token.id);
      expect(payment.email).to.be.equal(token.email);
      expect(payment.currency).to.be.equal('MXN');
      expect(payment.amount).to.be.equal(10);
      return Promise.resolve();
    });
    const notify = chai.spy(noop);
    const showAdditionalUserInfoForm = chai.spy(noop);


    const props = {
      groupid: 1,
      donate,
      notify,
      group: {
        currency: 'MXN'
      },
      showAdditionalUserInfoForm,
      fetchGroup: noop,
      fetchTransactions: noop,
      frequency: 'month'
    };

    donateToGroup.call({props}, 10, token)
    .then(() => {
      expect(donate).to.have.been.called();
      expect(notify).to.not.have.been.called();
      expect(showAdditionalUserInfoForm).to.have.been.called();
      done();
    });
  });

  it('should not donate with subscription to the group if frequency is none', (done) => {
    const token = {
      id: 'tok_17BNlt2eZvKYlo2CVoTcWs9D',
      email: 'test@gmail.com'
    };
    const donate = chai.spy((groupid, payment) => {
      expect(groupid).to.be.equal(1);
      expect(payment.frequency).to.not.be.ok;
      expect(payment.stripeToken).to.be.equal(token.id);
      expect(payment.email).to.be.equal(token.email);
      expect(payment.amount).to.be.equal(10);
      expect(payment.amount).to.be.equal(10);
      return Promise.resolve();
    });
    const notify = chai.spy(noop);
    const showAdditionalUserInfoForm = chai.spy(noop);

    const props = {
      groupid: 1,
      donate,
      group: {
        currency: 'MXN'
      },
      notify,
      showAdditionalUserInfoForm,
      fetchGroup: noop,
      fetchTransactions: noop,
      frequency: 'one-time'
    };

    donateToGroup.call({props}, 10, token)
    .then(() => {
      expect(donate).to.have.been.called();
      expect(notify).to.not.have.been.called();
      expect(showAdditionalUserInfoForm).to.have.been.called();
      done();
    });
  });

  it('should save the user info', (done) => {
    const validateDonationProfile = chai.spy(noop);
    const notify = chai.spy(noop);
    const updateUser = chai.spy(noop);
    const fetchUsers = chai.spy(noop);
    const hideAdditionalUserInfoForm = chai.spy(noop);
    const pushState = chai.spy((ctx, url) => {
      expect(url).to.be.equal('/groupslug?status=thankyou')
    });

    const profileForm = {
      attributes: {
        name: 'john doe',
        website: 'http://www.opencollective.com',
        twitterHandle: 'asood123'
      }
    }
    const props = {
      users: {newUser: {id: 1}},
      groupid: 1,
      profileForm,
      validateDonationProfile,
      updateUser,
      hideAdditionalUserInfoForm,
      pushState,
      notify,
      slug: 'groupslug',
      fetchUsers
    }
    save.call({props})
    .then(() => {
      expect(validateDonationProfile).to.have.been.called();
      expect(notify).to.not.have.been.called();
      expect(updateUser).to.have.been.called();
      expect(hideAdditionalUserInfoForm).to.have.been.called();
      expect(pushState).to.have.been.called();
      done();
    })
  });

  it('should send a notification if the donation fails', (done) => {
    const error = { message: 'Fail' };
    const donate = chai.spy(() => Promise.resolve({ error }));
    const notify = chai.spy((type) => {
      expect(type).to.be.equal('error');
    });
    const props = {
      groupid: 1,
      donate,
      notify,
      group: {
        currency: 'MXN'
      }
    };
    const token = {
      id: 'tok_17BNlt2eZvKYlo2CVoTcWs9D',
      email: 'test@gmail.com'
    };

    donateToGroup.call({props}, 10, token)
    .then(() => {
      expect(donate).to.have.been.called();
      expect(notify).to.have.been.called();
      done();
    });
  });

  it('should render a notification', () => {
    const notification = {
      status: 'error',
      message: 'Fail'
    };
    const element = createElement({
      fetchGroup: noop,
      fetchTransactions: noop,
      fetchUsers: noop,
      resetNotifications: noop,
      groupid: 1,
      group: {},
      notification,
      admin: {},
      expenses: [],
      frequency: 'one-time',
      donations: []
    }, 'Notification');

    expect(element.className).to.contain(notification.status);
    expect(element.innerHTML).to.contain(notification.message);
  });
});
