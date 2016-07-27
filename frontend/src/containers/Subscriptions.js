import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import LoginTopBar from '../containers/LoginTopBar';
import PublicFooter from '../components/PublicFooter';
import Currency from '../components/Currency';
import TransactionItem from '../components/TransactionItem';
import Notification from '../containers/Notification';
import InlineToggle from '../components/InlineToggle';
import ProfilePhoto from '../components/ProfilePhoto';
import SubscriptionItem from '../components/SubscriptionItem';

import cancelSubscription from '../actions/subscriptions/cancel';
import notify from '../actions/notification/notify';
import getSubscriptions from '../actions/subscriptions/get';

import i18n from '../lib/i18n';

export class Subscriptions extends Component {
  render() {
    const {
      subscriptions,
      i18n,
      pushState
    } = this.props;

    return (
      <div className='Subscriptions'>
        <LoginTopBar />
        <Notification />
        <div className='Subscriptions-container'>
          {!subscriptions.length ? <b>empty</b> : null}
          {subscriptions.length ? subscriptions.map(subscription => <SubscriptionItem key={subscription.id} subscription={subscription} {...this.props}/>) : null}
        </div>
        <PublicFooter />
      </div>
    );
  }

  componentDidMount(){
    const { getSubscriptions } = this.props;
    getSubscriptions();
  }

}

export function cancel(id) {
  const {
    cancelSubscription,
    notify,
    getSubscriptions
  } = this.props;

  if (window.confirm("Are you sure you want to cancel?")) {
    return cancelSubscription(id)
      .then(() => notify('success', 'Canceled'))
      .then(() => getSubscriptions())
      .catch(({message}) => notify('error', message));
    }
}

export default connect(mapStateToProps, {
  notify,
  cancelSubscription,
  getSubscriptions,
  pushState
})(Subscriptions);

export function mapStateToProps({
  session,
  subscriptions,
}) {

  return {
    session,
    subscriptions: subscriptions.list,
    i18n: i18n('en')
  };
}
