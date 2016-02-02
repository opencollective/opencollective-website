import chai from 'chai';
import spies from 'chai-spies';
import _ from 'lodash';

import {
  deleteExpense,
  mapStateToProps
} from '../../../containers/TransactionDetail';

import roles from '../../../constants/roles';
import createStore from '../../../store/create';

const defaultState = createStore().getState();

const { expect } = chai;

chai.use(spies);

describe('TransactionDetail container', () => {
  var pageState = _.merge({}, defaultState, {
    router: {
      params: {
        transactionid: 1,
        groupid: 1
      }
    },
    session: {
      user: { id: 1 }
    },
    users: {
      1: {
        groups: {
          1: { role: roles.HOST }
        }
      }
    }
  });

  it('hides the delete buttons if the transaction is approved', () => {
    const props = mapStateToProps(_.merge({}, pageState, {
      transactions: {
        1: {
          isRejected: false,
          isExpense: true
        }
      }
    }));

    expect(props.showDeleteButton).to.be.false;
  });

  it('hides the delete buttons if the transaction is a donation', () => {
    const props = mapStateToProps(_.merge({}, pageState, {
      transactions: {
        1: {
          isRejected: true,
          isExpense: false
        }
      }
    }));

    expect(props.showDeleteButton).to.be.false;
  });

  it('show the delete buttons if the transaction is a rejected expense and the user a host', () => {
    const props = mapStateToProps(_.merge({}, pageState, {
      transactions: {
        1: {
          isRejected: true,
          isExpense: true
        }
      }
    }));

    expect(props.showDeleteButton).to.be.true;
  });

  it('shows the approval buttons if expense is not reimbursed, not rejected, user is host', () => {
    const props = mapStateToProps(_.merge({}, pageState, {
      transactions: {
        1: {
          isRejected: false,
          isExpense: true,
          isReimbursed: false
        }
      }
    }));

    expect(props.showApprovalButtons).to.be.true;
  });

  it('deletes expense and redirects to the transaction page', (done) => {
    const deleteTransaction = chai.spy(() => Promise.resolve());
    const nextPage = chai.spy(() => {});
    const notify = chai.spy(() => Promise.resolve());

    const props = {
      transactionid: 1,
      groupid: 1,
      deleteTransaction,
      notify // to refactor with noop
    };

    deleteExpense.call({ props, nextPage })
      .then(() => {
        expect(deleteTransaction).to.have.been.called();
        expect(nextPage).to.have.been.called();
        expect(notify).to.have.been.called();
        done();
      })
      .catch(done);
  })

});
