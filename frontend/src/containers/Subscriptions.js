import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import LoginTopBar from '../containers/LoginTopBar';
import PublicFooter from '../components/PublicFooter';
import Notification from '../containers/Notification';
import SubscriptionItem from '../components/SubscriptionItem';

import cancelSubscription from '../actions/subscriptions/cancel';
import notify from '../actions/notification/notify';
import getSubscriptions from '../actions/subscriptions/get';

import i18n from '../lib/i18n';

export class Subscriptions extends Component {
  render() {
    const {
      subscriptions,
      pushState
    } = this.props;

    return (
      <div className='Subscriptions'>
        <LoginTopBar />
        <Notification />
        <div className='Subscriptions-container'>
          {!subscriptions.length ? (
            <div className='block-container center'>
              <p> Looks like you aren't contributing right now. Let's fix it!</p>
              <p> Visit our <a href='/leaderboard'>Leaderboard</a> to find more collectives to support. </p>
            </div>
          ) : null}
          {subscriptions.length ? subscriptions.map(subscription => {
            return (<SubscriptionItem
              key={subscription.id}
              subscription={subscription}
              onCancel={cancel.bind(this)}
              onClickImage={() => pushState(null, `/${subscription.Transactions[0].Group.slug}`)}
              {...this.props} />
            )
          }) : null}
          {subscriptions.length ? (
            <div className='block-container center'>
              <p> Visit our <a href='/leaderboard'>Leaderboard</a> to find more collectives to support! </p>
            </div>
          ) : null}
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
