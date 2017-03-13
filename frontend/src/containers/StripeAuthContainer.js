import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// components
import StripeAuth from '../components/StripeAuth';

// actions
import authorizeStripe from '../actions/users/authorize_stripe';
import notify from '../actions/notification/notify';

// selectors
import { 
  getStripeAccountSelector,
  getConnectStripeInProgressSelector } from '../selectors/users';
import { getAuthenticatedUserSelector } from '../selectors/session';
import {
  getI18nSelector } from '../selectors/collectives';
import { getStripeStatusQuerySelector } from '../selectors/router';


class StripeAuthContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const {
      stripeStatusQuery,
      notify
    } = this.props;

    if (stripeStatusQuery && stripeStatusQuery === 'success') {
      notify('success', 'Stripe account successfully connected');
    }
  }

  render() {
    const {
      stripeAccount,
      connectStripeInProgress,
      i18n,
      authorizeStripe
    } = this.props;

    return (
      <StripeAuth 
        stripeAccount={ stripeAccount }
        onClick={ authorizeStripe.bind(this) }
        onClickInProgress={ connectStripeInProgress }
        i18n={ i18n }
      />);
  }
}

const mapStateToProps = createStructuredSelector({
  // general data
  stripeAccount: getStripeAccountSelector,
  stripeStatusQuery: getStripeStatusQuerySelector,
  connectStripeInProgress: getConnectStripeInProgressSelector,
  
  // auth related
  authenticatedUser: getAuthenticatedUserSelector,

  // other
  i18n: getI18nSelector,
});

export default connect(mapStateToProps, {
  authorizeStripe,
  notify
})(StripeAuthContainer);
