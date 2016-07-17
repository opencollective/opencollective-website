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
      <div className='Subscription'>
        <div className='container center'>
        <LoginTopBar />

        <Notification />
        <div className='PublicContent'>
          <div className='Subscription-header'>
            <div className='Subscription-page-title'>
              <h3> Your Subscriptions </h3>
            </div>
            {subscriptions.length > 0 &&
              <div className='Subscription-user'>
                 <ProfilePhoto
                    hasBorder={true}
                    url={subscriptions[0].Transactions[0].User && subscriptions[0].Transactions[0].User.avatar} />
                {subscriptions[0].Transactions[0].User.name ?
                  <span className='Subscription-user-name' title={subscriptions[0].Transactions[0].User.email}> {subscriptions[0].Transactions[0].User.name}</span> :
                  <span className='Subscription-user-name'> {subscriptions[0].Transactions[0].User.email}</span>
                }
              </div>
            }
          </div>
          {subscriptions.map(subscription => {
              const divStyle = {
                backgroundImage: `url(${subscription.Transactions[0].Group.logo})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center'
              };
            return (
                <div className='Subscription-group' key={subscription.id} >
                  <div className='Subscription-logo' style={divStyle} onClick={() => pushState(null, `/${subscription.Transactions[0].Group.slug}`)} >
                  </div>
                  <div className='Subscription-info'>
                    <div className='Subscription-name'>
                        {subscription.Transactions[0].Group.name}
                    </div>
                    <div className='Subscription-amount'>
                        <Currency value={subscription.amount} currency={subscription.currency} colorify={false}/> {subscription.interval}ly
                        {subscription.isActive &&
                        subscription.createdAt ?
                          <span className='Subscription-status'>
                            &nbsp;({i18n.getString('since')} {moment(subscription.createdAt).format('MMM YYYY')})
                            {subscription.isActive &&
                              <span className='Subscription-cancel' onClick={cancel.bind(this, subscription.id)}>CANCEL</span>}
                          </span> :
                        <span className='Subscription-status'> (Inactive) </span>
                      }
                    </div>
                  </div>
                    <div className='Subscription-transactions'>
                      <InlineToggle showString='Show transactions' hideString='Hide transactions'>
                        {subscription.Transactions.map(transaction => {
                          return <TransactionItem key={transaction.id} transaction={transaction} i18n={i18n} />;
                        })}
                      </InlineToggle>
                    </div>

                </div>
              );
          })}
          {subscriptions.length > 0 &&
            <div className='Subscription-text Subscription-bottom-text'>
              <p> Visit our <a href='https://www.opencollective.com/leaderboard'>Leaderboard</a> to find more collectives to support! </p>
            </div>
          }
          {subscriptions.length === 0 &&
            <div className='Subscription-text'>
            <p> Looks like you aren't contributing right now. Let's fix it!</p>
            <p> Visit our <a href='https://www.opencollective.com/leaderboard'>Leaderboard</a> to find more collectives to support. </p>
            </div>
          }
        </div>
        <PublicFooter />
        </div>
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