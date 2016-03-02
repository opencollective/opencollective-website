import chai, { expect } from 'chai';
import spies from 'chai-spies';
import noop from '../helpers/noop';

import {
  cancel,
  sendToken,
  mapStateToProps
} from '../../../frontend/src/containers/Subscriptions';

chai.use(spies);

describe('Subscriptions container', () => {

  describe('mapStateToProps', () => {
    it('maps the token from the router', () => {
      const token = 'token_abc';
      const state = mapStateToProps({
        router: {
          params: { token }
        },
        subscriptions: {}
      });

      expect(state.token).to.be.equal(token);
    })
  });

  describe('cancel', () => {
    it('notifies if it fails', (done) => {
      const props = {
        notify: chai.spy(noop),
        cancelSubscription: () => Promise.reject({ message: 'canceling failed' }),
        token: 'token_abc'
      };

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

      cancel.call({props})
        .then(() => {
          expect(props.notify).to.have.been.called.with('success');
          done();
        });
    })
  });

  describe('sendToken', () => {
    it('notifies if it fails', (done) => {
      const props = {
        notify: chai.spy(noop),
        sendSubscriptionsToken: () => Promise.reject({ message: 'sending failed' }),
        token: 'token_abc'
      };

      sendToken.call({props})
        .then(() => {
          expect(props.notify).to.have.been.called.with('error');
          done();
        });
    });

    it('notifies if it is successful', (done) => {
      const props = {
        notify: chai.spy(noop),
        sendSubscriptionsToken: noop,
        token: 'token_abc'
      };

      sendToken.call({props})
        .then(() => {
          expect(props.notify).to.have.been.called.with('success');
          done();
        });
    })
  });
});
