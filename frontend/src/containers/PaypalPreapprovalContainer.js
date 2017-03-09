import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// components
import PaypalPreapproval from '../components/PaypalPreapproval';

// actions
import confirmPreapprovalKey from '../actions/users/confirm_preapproval_key';
import fetchCards from '../actions/users/fetch_cards';
import getApprovalKey from '../actions/users/get_approval_key';
import notify from '../actions/notification/notify';

// selectors
import { 
  getPaypalCardSelector,
  getConnectPaypalInProgressSelector } from '../selectors/users';
import { getAuthenticatedUserSelector } from '../selectors/session';
import {
  getI18nSelector } from '../selectors/collectives';
import { getPaypalQueryFieldsSelector } from '../selectors/router';


class PaypalPreapprovalContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: !this.props.paypalCard
    }
  }

  componentWillMount() {
    const {
      fetchCards,
      paypalCard,
      paypalQueryFields,
      authenticatedUser,
      confirmPreapprovalKey,
      notify
    } = this.props;


    const fetchCardsPromise = () => {
      if (authenticatedUser && !paypalCard) {
        return fetchCards(authenticatedUser.id, { service: 'paypal'})
        .then(() => this.setState({loading: false}));
      }
      return Promise.resolve();
    };

    const confirmPaypalPromise = () => {
      const {
        preapprovalKey,
        status
      } = paypalQueryFields;

      if (authenticatedUser && preapprovalKey && status === 'success') {
        return confirmPreapprovalKey(authenticatedUser.id, preapprovalKey)
        .then(() => fetchCards(authenticatedUser.id, { service: 'paypal'}))
        .then(() => this.setState({loading: false}))
        .then(() => notify('success', 'Successfully connected PayPal account'));
      }
      return Promise.resolve();
    };

    return Promise.all([
      fetchCardsPromise(),
      confirmPaypalPromise()
      ])
    .catch(error => notify('error', error.message));
  }

  render() {
    const {
      paypalCard,
      connectPaypalInProgress,
      authenticatedUser,
      i18n,
      getApprovalKey
    } = this.props;

    return (
      <PaypalPreapproval 
        card={ paypalCard }
        onClickConnect={ getApprovalKey.bind(this, authenticatedUser.id, { baseUrl: window.location})}
        onClickInProgress={ connectPaypalInProgress }
        i18n={ i18n }
        loading={ this.state.loading }
      />);
  }
}

const mapStateToProps = createStructuredSelector({
  // general data
  paypalCard: getPaypalCardSelector,
  paypalQueryFields: getPaypalQueryFieldsSelector,
  connectPaypalInProgress: getConnectPaypalInProgressSelector,

  // auth related
  authenticatedUser: getAuthenticatedUserSelector,

  // other
  i18n: getI18nSelector,
});

export default connect(mapStateToProps, {
  getApprovalKey,
  confirmPreapprovalKey,
  fetchCards,
  notify
})(PaypalPreapprovalContainer);
