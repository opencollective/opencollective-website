import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import LoginTopBar from '../containers/LoginTopBar';
import PublicFooter from '../components/PublicFooter';
import Notification from '../containers/Notification';

import updateExpense from '../actions/expenses/update';
import notify from '../actions/notification/notify';

import i18n from '../lib/i18n';

const messages = {
  approve: { processing: "Approving expense...", success: "Approved", forbidden: "You don't have the permission to approve this expense", error: "Error while approving expense" },
  reject: { processing: "Rejecting expense...", success: "Rejected", forbidden: "You don't have the permission to reject this expense", error: "Error while rejecting expense" }
};

export class UpdateExpense extends Component {
  render() {
    const {
      expenseId,
      action,
      pushState
    } = this.props;

    return (
      <div className='Expense'>
        <LoginTopBar />
        <Notification />
        <div className='Subscriptions-container'>
          {messages[action].processing}
        </div>
        <PublicFooter />
      </div>
    );
  }

  componentDidMount() {
    const { notify, updateExpense, action, slug, expenseId } = this.props;
    updateExpense(slug, expenseId, action)
      .then(() => notify('success', messages[action].success))
      .catch((error) => notify('error', messages[action][error.message ? error.message.toLowerCase() : 'error']));  
    }

}

export default connect(mapStateToProps, {
  notify,
  updateExpense,
  pushState
})(UpdateExpense);

export function mapStateToProps({
  session,
  router
}) {

  const slug = router.params.slug;
  const expenseId = router.params.expenseId;
  const action = router.params.action;

  return {
    session,
    i18n: i18n('en'),
    slug,
    expenseId,
    action
  };
}
