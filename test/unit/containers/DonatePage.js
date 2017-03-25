import chai from 'chai';
import spies from 'chai-spies';
import noop from '../helpers/noop';

import {
  donateToCollective,
  saveNewUser
} from '../../../frontend/src/containers/DonatePage';

const { expect } = chai;

chai.use(spies);

const donateActionResponseMock = {
  type: "DONATE_GROU_SUCCESS",
  json: {
    transaction: {
      uuid: 'bcf48936-f19c-4af0-9ee3-bd1f6f6cc27e'
    },
    user: {
      firstName: "Xavier",
      avatar: "avatarUrl"
    }
  }
};

const setup = () => {
  const actions = {
    donate: chai.spy(noop),
    notify: chai.spy((status, message) => console.log(">>> notify", status, message)),
    fetchTransactions: chai.spy(noop),
    fetchUsers: chai.spy(noop),
    fetchProfile: chai.spy(noop),
    appendProfileForm: chai.spy(noop),
    updateUser: chai.spy(noop),
    validateSchema: chai.spy(noop),
    decodeJWT: chai.spy(noop),
    appendDonationForm: chai.spy(noop)
  };

  const collective = {
    id: 1,
    slug: 'testcollective',
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
    collective,
    setState,
    refreshData,
    token
  };
};

describe('Collective container', () => {

  it('should donate to the collective', (done) => {
    const { actions, collective, setState, token } = setup();
    const { currency } = collective;

    const donate = chai.spy((slug, payment) => {
      expect(slug).to.be.equal(collective.slug);
      expect(payment.currency).to.be.equal('MXN');
      expect(payment.email).to.be.equal(token.email);
      expect(payment.amount).to.be.equal(1000);

      return Promise.resolve(donateActionResponseMock);
    });

    const props = {
      ...actions,
      donate,
      collective,
      slug: collective.slug,
      currency,
      location: { query: {} }
    };

    donateToCollective.call({ props, setState }, {
      amount: 10,
      interval: 'month',
      currency,
      token
    })
    .then(() => {
      expect(props.donate).to.have.been.called();
      expect(props.notify).to.not.have.been.called();
      done();
    })
    .catch(done)
  });

  it('should donate with subscription to the collective', (done) => {
    const { actions, collective, setState, refreshData, token } = setup();

    const donate = chai.spy((slug, payment) => {
      expect(slug).to.be.equal(collective.slug);
      expect(payment.interval).to.be.equal('month');
      expect(payment.stripeToken).to.be.equal(token.id);
      expect(payment.email).to.be.equal(token.email);
      expect(payment.currency).to.be.equal(collective.currency);
      expect(payment.amount).to.be.equal(1000);
      return Promise.resolve(donateActionResponseMock);
    });

    const props = {
      ...actions,
      donate,
      collective,
      slug: collective.slug,
      interval: 'month',
      location: { query: {} }
    };

    donateToCollective.call({props, setState, refreshData}, {
      amount: 10,
      interval: 'month',
      currency: collective.currency,
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
    const { actions, collective, setState } = setup();

    const pushState = chai.spy((ctx, url) => {
      expect(url).to.be.equal('/collectiveslug?status=thankyou')
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
      collective,
      location: { query: {} }
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
    const { collective, token, actions } = setup();

    const error = { message: 'Fail' };
    const donate = chai.spy(() => Promise.reject({ error }));
    const props = {
      ...actions,
      donate,
      collective,
      location: { query: {} }
    };

    donateToCollective.call({ props }, 10, 'month', 'MXN', token)
    .then(() => {
      expect(donate).to.have.been.called();
      expect(props.notify).to.have.been.called.with('error');
      done();
    })
    .catch(done)
  });


  it('should redirect after donation if ?redirect param', (done) => {
    const { actions, collective, setState, token } = setup();
    const { currency } = collective;
    const redirectUrl = 'http://test.com/callback';

    const donate = chai.spy((slug, payment) => {
      expect(slug).to.be.equal(collective.slug);
      expect(payment.currency).to.be.equal('MXN');
      expect(payment.email).to.be.equal(token.email);
      expect(payment.amount).to.be.equal(1000);

      return Promise.resolve(donateActionResponseMock);
    });

    const redirect = chai.spy((url) => {
      expect(url).to.equal(`${redirectUrl}?transactionuuid=${donateActionResponseMock.json.transaction.uuid}`);
    });

    const props = {
      ...actions,
      donate,
      redirect,
      collective,
      slug: collective.slug,
      currency,
      location: { query: { redirect: redirectUrl }}
    };

    donateToCollective.call({ props, setState }, {
      amount: 10,
      interval: 'month',
      currency,
      token
    })
    .then(() => {
      expect(props.donate).to.have.been.called();
      expect(props.notify).to.not.have.been.called();
      done();
    })
    .catch(done)
  });

});
