import chai from 'chai';
import spies from 'chai-spies';
import roles from '../../../constants/roles';

import {
  mapStateToProps
} from '../../../containers/GroupTransactions';

const { expect } = chai;

chai.use(spies);

describe('GroupTransactions container', () => {

  it('sets isHost to true if user is a host in group', () => {
    const users = {
      1: {
        groups: { 1: { role: roles.HOST} },
        transactions: {}
      }
    };
    const state = mapStateToProps({
      users,
      groups: {},
      session: { user: { id: 1 }},
      router: { location: { query: {} }, params: { groupid: 1} }
    });

    expect(state.isHost).to.be.equal(true);
  });


});
