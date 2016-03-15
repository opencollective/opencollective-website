import chai, { expect } from 'chai';
import spies from 'chai-spies';
import noop from '../helpers/noop';

import {
  cancel,
  refreshToken,
  sendNewToken,
  mapStateToProps
} from '../../../frontend/src/containers/Subscriptions';

chai.use(spies);

describe('constainers/Subscriptions', () => {

  describe('mapStateToProps', () => {
    it('maps the token from the router', () => {
      const token = 'token_abc';
      const state = mapStateToProps({
        router: {
          params: { token }
        },
        subscriptions: {},
        users: {
          sendingEmailInProgress: false
        },
        session: {
          jwtInvalid: false,
          jwtExpired: false
        }
      });

      expect(state.token).to.be.equal(token);
    })
  });

  describe('cancel', () => {

    it('calls window.confirm', (done) => {
      const props = {
        notify: chai.spy(noop),
        cancelSubscription: () => Promise.reject({ message: 'canceling failed' }),
        token: 'token_abc'
      };

      const spy = chai.spy(window, 'confirm');

      cancel.call({props})
      expect(spy).to.have.been.called;
      done();
    });

    it('notifies if it fails', (done) => {
      const props = {
        notify: chai.spy(noop),
        cancelSubscription: () => Promise.reject({ message: 'canceling failed' }),
        token: 'token_abc'
      };

      window.confirm = () => true;

      cancel.call({props})
        .then(() => {
          expect(props.notify).to.have.been.called.with('error');
          done();
        });
    });

    it('notifies if it is successful', (done) => {
      const props = {
        notify: chai.spy(noop),
        cancelSubscription: noop,
        token: 'token_abc'
      };

      window.confirm = () => true;

      cancel.call({props})
        .then(() => {
          expect(props.notify).to.have.been.called.with('success');
          done();
        });
    });

  });

  describe('refreshToken', () => {
    it('notifies if it fails', (done) => {
      const props = {
        notify: chai.spy(noop),
        refreshSubscriptionsToken: () => Promise.reject({ message: 'sending failed' }),
        token: 'token_abc'
      };

      refreshToken.call({props})
        .then(() => {
          expect(props.notify).to.have.been.called.with('error');
          done();
        });
    });

    it('notifies if it is successful', (done) => {
      const props = {
        notify: chai.spy(noop),
        refreshSubscriptionsToken: noop,
        token: 'token_abc'
      };

      refreshToken.call({props})
        .then(() => {
          expect(props.notify).to.have.been.called.with('success');
          done();
        });
    })
  });

  describe('sendNewToken', () => {
    it('notifies if it fails', (done) => {
      const props = {
        notify: chai.spy(noop),
        sendNewSubscriptionsToken: () => Promise.reject({ message: 'sending failed' }),
        token: 'token_abc'
      };

      sendNewToken.call({props})
        .then(() => {
          expect(props.notify).to.have.been.called.with('error');
          done();
        });
    });

    it('notifies if it is successful', (done) => {
      const props = {
        notify: chai.spy(noop),
        sendNewSubscriptionsToken: noop,
        token: 'token_abc'
      };

      sendNewToken.call({props})
        .then(() => {
          expect(props.notify).to.have.been.called.with('success');
          done();
        });
    })
  });
});
