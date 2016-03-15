import chai from 'chai';
import spies from 'chai-spies';
import noop from '../helpers/noop';

import {
  donateToGroup,
  saveNewUser
} from '../../../frontend/src/containers/PublicGroup';

const { expect } = chai;

chai.use(spies);

const setup = () => {
  const actions = {
    donate: chai.spy(noop),
    notify: chai.spy(noop),
    fetchTransactions: chai.spy(noop),
    fetchUsers: chai.spy(noop),
    fetchGroup: chai.spy(noop),
    appendProfileForm: chai.spy(noop),
    updateUser: chai.spy(noop),
    validateSchema: chai.spy(noop),
    decodeJWT: chai.spy(noop),
    appendDonationForm: chai.spy(noop)
  };

  const group = {
    id: 1,
    currency: 'MXN',
    host: { name: 'WWCode', website: 'http://womenwhocode.com' }
  };

  const setState = chai.spy(noop);
  const refreshData = chai.spy(noop);
  const token = {
    id: 'tok_17BNlt2eZvKYlo2CVoTcWs9D',
    email: 'test@gmail.com'
  };

  return {
    actions,
    group,
    setState,
    refreshData,
    token
  };
};

describe('PublicGroup container', () => {

  it('should donate to the group', (done) => {
    const { actions, group, setState, refreshData, token } = setup();
    const currency = group.currency;

    const donate = chai.spy((groupid, payment) => {
      expect(groupid).to.be.equal(1);
      expect(payment.currency).to.be.equal('MXN');
      expect(payment.email).to.be.equal(token.email);
      expect(payment.amount).to.be.equal(10);

      return Promise.resolve({});
    });

    const props = {
      ...actions,
      donate,
      group,
      currency
    };

    donateToGroup.call({ props, setState, refreshData }, {
      amount: 10,
      frequency: 'monthly',
      currency,
      token
    })
    .then(() => {
      expect(props.donate).to.have.been.called();
      expect(setState).to.have.been.called();
      expect(refreshData).to.have.been.called();
      expect(props.notify).to.not.have.been.called();
      done();
    })
    .catch(done)
  });

  it('should donate with subscription to the group', (done) => {
    const { actions, group, setState, refreshData, token } = setup();

    const donate = chai.spy((groupid, payment) => {
      expect(groupid).to.be.equal(1);
      expect(payment.interval).to.be.equal('month');
      expect(payment.stripeToken).to.be.equal(token.id);
      expect(payment.email).to.be.equal(token.email);
      expect(payment.currency).to.be.equal(group.currency);
      expect(payment.amount).to.be.equal(10);
      return Promise.resolve({});
    });

    const props = {
      ...actions,
      donate,
      group,
      frequency: 'monthly'
    };

    donateToGroup.call({props, setState, refreshData}, {
      amount: 10,
      frequency: 'monthly',
      currency: group.currency,
      token
    })
    .then(() => {
      expect(donate).to.have.been.called();
      expect(props.notify).to.not.have.been.called();
      expect(setState).to.have.been.called();
      done();
    })
    .catch(done);
  });

  it('should save the user info', (done) => {
    const { actions, group, setState } = setup();

    const pushState = chai.spy((ctx, url) => {
      expect(url).to.be.equal('/groupslug?status=thankyou')
    });

    const profileForm = {
      attributes: {
        name: 'john doe',
        website: 'http://www.opencollective.com',
        twitterHandle: 'asood123'
      }
    };

    const props = {
      ...actions,
      pushState,
      newUser: {id: 1},
      profileForm,
      group
    };

    saveNewUser.call({props, setState})
      .then(() => {
        expect(setState).to.have.been.called();
        expect(props.validateSchema).to.have.been.called();
        expect(props.notify).to.not.have.been.called();
        expect(props.updateUser).to.have.been.called();
        done();
      })
      .catch(done);
  });

  it('should send a notification if the donation fails', (done) => {
    const { group, token, actions } = setup();

    const error = { message: 'Fail' };
    const donate = chai.spy(() => Promise.reject({ error }));
    const props = {
      ...actions,
      donate,
      group
    };

    donateToGroup.call({ props }, 10, 'monthly', 'MXN', token)
    .then(() => {
      expect(donate).to.have.been.called();
      expect(props.notify).to.have.been.called.with('error');
      done();
    })
    .catch(done)
  });

});
