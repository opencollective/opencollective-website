import chai from 'chai';
import spies from 'chai-spies';
import noop from '../helpers/noop';

import {
  donateToGroup,
  saveNewUser
} from '../../../frontend/src/containers/PublicGroup';

const { expect } = chai;

chai.use(spies);

describe('PublicGroup container', () => {

  it('should donate to the group', (done) => {
    const notify = chai.spy(noop);
    const fetchGroup = chai.spy(noop);
    const fetchUsers = chai.spy(noop);
    const setState = chai.spy(noop);
    const token = {
      id: 'tok_17BNlt2eZvKYlo2CVoTcWs9D',
      email: 'test@gmail.com'
    };
    const donate = chai.spy((groupid, payment) => {
      expect(groupid).to.be.equal(1);
      expect(payment.currency).to.be.equal('MXN');
      expect(payment.email).to.be.equal(token.email);
      expect(payment.amount).to.be.equal(10);

      return Promise.resolve({});
    });

    const props = {
      donate,
      group: {
        id: 1,
        currency: 'MXN',
        host: { name: 'WWCode', website: 'http://womenwhocode.com' }
      },
      notify,
      fetchGroup,
      fetchUsers,
      currency: 'MXN',
      fetchTransactions: noop
    };

    donateToGroup.call({props, setState}, 10, 'monthly', 'MXN', token)
    .then(() => {
      expect(donate).to.have.been.called();
      expect(setState).to.have.been.called();
      expect(fetchGroup).to.have.been.called();
      expect(fetchUsers).to.have.been.called();
      expect(notify).to.not.have.been.called();
      done();
    })
    .catch(done)
  });

  it('should donate with subscription to the group', (done) => {
    const setState = chai.spy(noop);
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
      return Promise.resolve({});
    });
    const notify = chai.spy(noop);


    const props = {
      donate,
      notify,
      group: {
        id: 1,
        currency: 'MXN',
        host: { name: 'WWCode', website: 'http://womenwhocode.com' }
      },
      fetchGroup: noop,
      fetchUsers: noop,
      currency: 'MXN',
      fetchTransactions: noop,
      frequency: 'monthly'
    };

    donateToGroup.call({props, setState}, 10, 'monthly', 'MXN', token)
    .then(() => {
      expect(donate).to.have.been.called();
      expect(notify).to.not.have.been.called();
      expect(setState).to.have.been.called();
      done();
    });
  });

  it('should save the user info', (done) => {
    const setState = chai.spy(noop);
    const validateDonationProfile = chai.spy(noop);
    const notify = chai.spy(noop);
    const updateUser = chai.spy(noop);
    const fetchUsers = chai.spy(noop);
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
      profileForm,
      validateDonationProfile,
      updateUser,
      pushState,
      notify,
      group: {
        id: 1,
        slug: 'groupslug'
      },
      fetchUsers
    }

    saveNewUser.call({props, setState})
      .then(() => {
        expect(validateDonationProfile).to.have.been.called();
        expect(setState).to.have.been.called();
        expect(notify).to.not.have.been.called();
        expect(updateUser).to.have.been.called();
        done();
      })
      .catch(done);
  });

  it('should send a notification if the donation fails', (done) => {
    const error = { message: 'Fail' };
    const donate = chai.spy(() => Promise.resolve({ error }));
    const notify = chai.spy((type) => {
      expect(type).to.be.equal('error');
    });
    const props = {
      donate,
      notify,
      group: {
        id: 1,
        currency: 'MXN',
        host: { name: 'WWCode', website: 'http://womenwhocode.com' }
      }
    };
    const token = {
      id: 'tok_17BNlt2eZvKYlo2CVoTcWs9D',
      email: 'test@gmail.com'
    };

    donateToGroup.call({props}, 10, 'monthly', 'MXN', token)
    .then(() => {
      expect(donate).to.have.been.called();
      expect(notify).to.have.been.called();
      done();
    });
  });

});
