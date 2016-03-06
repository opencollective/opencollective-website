import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

// import Content from './Content';


import values from 'lodash/object/values';

import createTransaction from '../actions/transactions/create';
import uploadImage from '../actions/images/upload';

import resetTransactionForm from '../actions/form/reset_transaction';
import appendTransactionForm from '../actions/form/append_transaction';
import validateTransaction from '../actions/form/validate_transaction';

import tags from '../ui/tags';
import vats from '../ui/vat';
 
import roles from '../constants/roles';
import PublicTopBar from '../components/PublicTopBar';
import Notification from '../components/Notification';
import PublicFooter from '../components/PublicFooter';
import PublicGroupThanks from '../components/PublicGroupThanks';
import DisplayUrl from '../components/DisplayUrl';
import PublicGroupSignup from '../components/PublicGroupSignup';
import Tiers from '../components/Tiers';

import fetchGroup from '../actions/groups/fetch_by_id';
import donate from '../actions/groups/donate';
import notify from '../actions/notification/notify';
import resetNotifications from '../actions/notification/reset';
import appendDonationForm from '../actions/form/append_donation';
import appendProfileForm from '../actions/form/append_profile';
import updateUser from '../actions/users/update_user';
import validateDonationProfile from '../actions/form/validate_donation_profile';
import logout from '../actions/session/logout';
import decodeJWT from '../actions/session/decode_jwt';

import ExpenseForm from '../components/ExpenseForm';

// Number of expenses and revenue items to show on the public page
const NUM_TRANSACTIONS_TO_SHOW = 3;

export class SubmitExpensePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showThankYouMessage: false,
      showUserForm: false
    };
  }
  
  render() {
    const {
      group,
      isAuthenticated
    } = this.props;

    var body;
    if (this.state.showThankYouMessage || (isAuthenticated && this.state.showUserForm)) { // we don't handle userform from logged in users) {
      body = <PublicGroupThanks message="Expense sent" />;
    } else if (this.state.showUserForm) {
      body = <PublicGroupSignup {...this.props} save={saveNewUser.bind(this)} />
    } else {
      body = <ExpenseForm {...this.props} handleSubmit={createExpense.bind(this)} />
    }

    return (
      <div className='PublicGroup'>
        <PublicTopBar session={this.props.session} logout={this.props.logout} slug={group.slug}/>
        <Notification {...this.props} />

        <div className='PublicContent'>

          <div className='PublicGroupHeader'>
            <img className='PublicGroupHeader-logo' src={group.logo ? group.logo : '/static/images/media-placeholder.svg'} />
            <div className='PublicGroupHeader-website'><DisplayUrl url={group.website} /></div>
            <div className='PublicGroupHeader-host'>Hosted by <a href={group.host.website}>{group.host.name}</a></div>
            <div className='PublicGroupHeader-description'>
              Submit an expense to {group.name}
            </div>
          </div>
          {body}
            
        </div>
        <PublicFooter />
      </div>
    );
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
  }
}

export function createExpense() {
  const {
    notify,
    pushState,
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
})(SubmitExpensePage);

function mapStateToProps({router, form, notification, images, groups}) {
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