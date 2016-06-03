import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import values from 'lodash/object/values';

import createTransaction from '../actions/transactions/create';
import uploadImage from '../actions/images/upload';

import resetTransactionForm from '../actions/form/reset_transaction';
import appendTransactionForm from '../actions/form/append_transaction';
import validateTransaction from '../actions/form/validate_transaction';

import tags from '../ui/tags';
import vats from '../ui/vat';

import roles from '../constants/roles';
import PublicGroupThanks from '../components/PublicGroupThanks';

import fetchGroup from '../actions/groups/fetch_by_id';
import notify from '../actions/notification/notify';
import resetNotifications from '../actions/notification/reset';
import decodeJWT from '../actions/session/decode_jwt';

import ExpenseForm from '../components/ExpenseForm';

export class SubmitExpense extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showThankYouMessage: false,
    };
  }

  render() {
    const {
      onCancel
    } = this.props;

    if (this.state.showThankYouMessage) {
      return (<PublicGroupThanks message="Expense sent" />);
    } else {
      return (<ExpenseForm {...this.props} onSubmit={createExpense.bind(this)} onCancel={onCancel} />);
    }

  }

  componentWillMount() {
    const {
      group,
      fetchGroup
    } = this.props;

    fetchGroup(group.id);

  }

  componentDidMount() {
    // decode here because we don't handle auth on the server side yet
    this.props.decodeJWT();
    window.scrollTo(0,0);
  }
}

export function createExpense() {
  const {
    notify,
    createTransaction,
    group,
    validateTransaction,
    transaction
  } = this.props;
  const attributes = transaction.attributes;

  return validateTransaction(attributes)
  .then(() => {
    const newTransaction = {
      ...attributes,
      amount: -attributes.amount,
      currency: group.currency
    };
    return createTransaction(group.id, newTransaction);
  })
  .then(() => {
    window.scrollTo(0, 0);
    this.setState({ showThankYouMessage: true })
  })
  .catch(error => notify('error', error.message));
};

export default connect(mapStateToProps, {
  createTransaction,
  uploadImage,
  resetTransactionForm,
  appendTransactionForm,
  validateTransaction,
  pushState,
  notify,
  decodeJWT,
  fetchGroup,
  resetNotifications
})(SubmitExpense);


function mapStateToProps({form, notification, images, groups}) {
  const transaction = form.transaction;

  const group = values(groups)[0] || {stripeAccount: {}}; // to refactor to allow only one group

  const usersByRole = group.usersByRole || {};

  /* @xdamman:
   * We should refactor this. The /api/group route should directly return
   * group.host, group.backers, group.members, group.donations, group.expenses
   */
  group.id = Number(group.id);

  group.hosts = usersByRole[roles.HOST] || [];
  group.members = usersByRole[roles.MEMBER] || [];
  group.backers = usersByRole[roles.BACKER] || [];

  group.host = group.hosts[0] || {};

  return {
    group,
    notification,
    transaction,
    tags: tags(group.id),
    enableVAT: vats(group.id),
    isUploading: images.isUploading || false
  };
}
