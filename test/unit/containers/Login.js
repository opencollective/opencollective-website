import chai, { expect } from 'chai';
import spies from 'chai-spies';
import noop from '../helpers/noop';

import {
  sendNewToken,
  mapStateToProps
} from '../../../frontend/src/containers/Login';

chai.use(spies);

describe('containers/Login', () => {

  describe('mapStateToProps', () => {
    it('maps the token from the router', () => {
      const token = 'token_abc';
      const state = mapStateToProps({
        router: {
          params: { token },
          location: {query: '/'}
        },
        users: {
          sendingEmailInProgress: false
        },
        form: {
          schema: {

          }
        }
      });

      expect(state.token).to.be.equal(token);
    })
  });

  /* Not yet implemented
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
  */

  describe('sendNewToken', () => {
    it('notifies if it fails', (done) => {
      const props = {
        notify: chai.spy(noop),
        sendNewLoginToken: () => Promise.reject({ message: 'sending failed' }),
        token: 'token_abc'
      };
      const setState = chai.spy(noop);

      sendNewToken.call({props, setState})
        .then(() => {
          expect(props.notify).to.have.been.called.with('error');
          expect(setState).to.have.been.called.with({inProgress: false, disabled: false});
          done();
        });
    });

    it('notifies if it is successful', (done) => {
      const props = {
        notify: chai.spy(noop),
        sendNewLoginToken: noop,
        token: 'token_abc'
      };
      const setState = chai.spy(noop);

      sendNewToken.call({props,setState})
        .then(() => {
          expect(setState).to.have.been.called.with({showConfirmation: true});
          done();
        });
    })
  });
});
