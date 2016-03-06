import React, { Component } from 'react';

import { connect } from 'react-redux';
import values from 'lodash/object/values';

import roles from '../constants/roles';
import PublicTopBar from '../components/PublicTopBar';
import Notification from '../components/Notification';
import PublicFooter from '../components/PublicFooter';
import PublicGroupThanks from '../components/PublicGroupThanks';
import DisplayUrl from '../components/DisplayUrl';
import PublicGroupSignup from '../components/PublicGroupSignup';
import Tiers from '../components/Tiers';

import fetchGroup from '../actions/groups/fetch_by_id';
import fetchUsers from '../actions/users/fetch_by_group';
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

export class DonatePage extends Component {

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
              {group.description}
            </div>
          </div>
          <ExpenseForm
            {...this.props}
            handleSubmit={createExpense.bind(this)} />
            
        </div>
        <PublicFooter />
      </div>
    );
  }

  componentWillMount() {
    const {
      group,
      fetchUsers,
      fetchGroup
    } = this.props;

    fetchGroup(group.id);

    fetchUsers(group.id);
  }

  componentDidMount() {
    // decode here because we don't handle auth on the server side yet
    this.props.decodeJWT();
  }
}

export function createExpense() {
  const {
    notify,
    groupid,
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
  .then(() => pushState(null, `/groups/${groupid}/transactions`))
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
  fetchGroup,
  resetNotifications
})(TransactionNew);

function mapStateToProps({router, form, notification, images, groups}) {
  const transaction = form.transaction;
  const groupid = router.params.groupid;

  return {
    groupid,
    group: groups[groupid] || {},
    notification,
    transaction,
    tags: tags(groupid),
    enableVAT: vats(groupid),
    isUploading: images.isUploading || false
  };
}