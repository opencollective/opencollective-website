import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai from 'chai';
import spies from 'chai-spies';
import { Profile, save, cancel, getPreapprovalInfo } from '../../../containers/Profile';
import noop from '../helpers/noop';

const {expect} = chai;
const {
  findRenderedDOMComponentWithClass,
  renderIntoDocument
} = TestUtils;

const createElement = (props) => {
  const rendered = renderIntoDocument(<Profile {...props} />);
  return findRenderedDOMComponentWithClass(rendered, 'Profile');
};

chai.use(spies);

describe('Profile container', () => {

  describe('on mount', function () {
    const fetchUser = chai.spy(noop);
    const resetNotifications = chai.spy(noop);
    const getPreapprovalDetails = chai.spy(noop);
    const fetchCards = chai.spy(noop);

    before(() => {
      createElement({
        fetchUser,
        resetNotifications,
        getPreapprovalDetails,
        fetchCards,
        fetchGroups: noop,
        notification: {},
        userid: 1,
        user: {},
        preapprovalDetails: {},
        groups: []
      });
    });

    it('should fetch user data', () => {
      expect(fetchUser).to.have.been.called();
    });

    it('should reset the notifications', () => {
      expect(resetNotifications).to.have.been.called();
    });

    it('should fetch get the cards', () => {
      expect(fetchCards).to.have.been.called();
    });
  });

  it('should notify when validateProfile fails on saving', (done) => {
    const message = 'fail';
    const validateProfile = () => Promise.resolve({error: { message }});
    const notify = chai.spy(noop);

    const props = {
      validateProfile,
      notify,
      form: { attributes: {} }
    };

    save.apply({props})
    .then(() => {
      expect(notify).to.have.been.called.with('error');
      done();
    });
  });


  it('should call updatePaypalEmail when validateProfile succeeds', (done) => {
    const updatePaypalEmail = chai.spy(noop);

    const props = {
      validateProfile: noop,
      fetchUser: noop,
      setEditMode: noop,
      updatePaypalEmail,
      user: { id: 1 },
      form: { attributes: {paypalEmail: 'test@gmail.com'} }
    };


    save.apply({props})
      .then(() => {
        expect(updatePaypalEmail).to.have.been.called.with(1);
        done();
      });
  });

  it('should setEditMode to false when canceling', () => {
    const setEditMode = chai.spy(noop);

    cancel.apply({ props: { setEditMode }});

    expect(setEditMode).to.have.been.called.with(false);
  });

  it('should get preapproval details if the card has a token', (done) => {
    const getPreapprovalDetails = chai.spy((userid, token) => {
      expect(userid).to.be.equal(1);
      expect(token).to.be.equal('abc');
      return Promise.resolve();
    });

    const props = {
      userid: 1,
      getPreapprovalDetails,
      card: { token: 'abc' },
      fetchCards: noop
    };

    getPreapprovalInfo.call({props})
    .then(() => {
      expect(getPreapprovalDetails).to.have.been.called();
      done();
    });
  });

  it('should NOT get preapproval details if the card does not have a token', (done) => {
    const getPreapprovalDetails = chai.spy(noop);

    const props = {
      userid: 1,
      getPreapprovalDetails,
      card: {},
      fetchCards: noop
    };

    getPreapprovalInfo.call({props})
    .then(() => {
      expect(getPreapprovalDetails).to.not.have.been.called();
      done();
    });
  });

});
