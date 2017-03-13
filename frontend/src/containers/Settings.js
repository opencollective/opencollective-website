import React, { Component, PropTypes } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

// lib

// Containers
import LoginTopBar from './LoginTopBar';
import Notification from './Notification';

// components
import PublicFooter from '../components/PublicFooter';
import PaypalReminder from '../components/PaypalReminder';
import StripeReminder from '../components/StripeReminder';

// actions
import approveExpense from '../actions/expenses/approve';
import authorizeStripe from '../actions/users/authorize_stripe';
import fetchPendingExpenses from '../actions/expenses/fetch_pending_by_collective';
import fetchTransactions from '../actions/transactions/fetch_by_collective';
import fetchProfile from '../actions/profile/fetch_by_slug';
import fetchUsers from '../actions/users/fetch_by_group'; // TODO: change to collective
import notify from '../actions/notification/notify';
import payExpense from '../actions/expenses/pay';
import rejectExpense from '../actions/expenses/reject';
import validateSchema from '../actions/form/validate_schema';
import fetchCards from '../actions/users/fetch_cards';
import getApprovalKey from '../actions/users/get_approval_key';
import confirmPreapprovalKey from '../actions/users/confirm_preapproval_key';

// Selectors
import {
  canEditCollectiveSelector,
  getI18nSelector,
  getPopulatedCollectiveSelector,
  isHostOfCollectiveSelector,
  connectedToStripeAccountSelector } from '../selectors/collectives';
import { 
  getUsersSelector,
  getPaypalCardSelector,
  getConnectPaypalInProgressSelector,
  getConnectStripeInProgressSelector } from '../selectors/users';
import { getAuthenticatedUserSelector } from '../selectors/session';

const SETTINGS_PAGES = [
  'general',
  'host'
];

export class Settings extends Component {

  constructor(props) {
    super(props);
    const urlHash = this.getUrlHash();
    const validUrlHash = SETTINGS_PAGES.indexOf(urlHash) !== -1;
    if (!validUrlHash) this.setUrlHash(SETTINGS_PAGES[0]);
    this.state = {
      currentPage: validUrlHash ? urlHash : SETTINGS_PAGES[0],
    };
    this.onSaveGeneralRef = this.onSaveGeneral.bind(this);
    this.onSaveHostRef = this.onSaveHost.bind(this);
  }



  render() {
    const { 
      authenticatedUser, 
      i18n, 
      isHost,
      connectPaypalInProgress,
      connectStripeInProgress,
      connectedToStripeAccount,
      authorizeStripe
    } = this.props;

    const { view } = this.state;
    return (
      <div className='Settings'>
        <LoginTopBar />
        <Notification />

        <div className='Settings-container'>
          <Grid flex>
            <Column>
              <div className='SettingsNavHeader'>Your Settings</div>
              <div className='SettingsNav'>
                {SETTINGS_PAGES.map(pageName => {
                  return (
                    <div
                      key={pageName}
                      className={`SettingsNavItem ${currentPage === pageName ? 'SettingsNavItem--active' : ''}`}
                      onClick={() => {
                        this.setState({currentPage: pageName});
                        this.setUrlHash(pageName);
                      }}
                      >{pageName}</div>
                  )
                })}
              </div>
            </Column>
            <Column auto>
              <div className='SettingsPage'>
                {currentPage === 'general' && <SettingsUserGeneral currency={currency} language={settings.lang} onSave={this.onSaveGeneralRef} />}
                {currentPage === 'host' && <SettingsUserHost onSave={this.onSaveBankingRef} />}
              </div>
            </Column>
          </Grid>
        </div>
        <PublicFooter />
      </div>
    );

  }

  componentWillMount() {
   
   }

  getUrlHash() {
    return this.props.location.hash ? this.props.location.hash.substr(1).trim().toLowerCase().replace('-', ' ') : '';
  }

  setUrlHash(name) {
    window.location.hash = name.replace(' ', '-');
  }
}



/*
 * Get Paypal Preapproval key
 */
export function getPaypalPreapprovalKey(userId) {
  const {
    getApprovalKey
  } = this.props;

  return getApprovalKey(userId, { baseUrl: window.location})
}

const mapStateToProps = createStructuredSelector({
  // general data
  user: authenticatedUser,

  // Payments related
  paypalCard: getPaypalCardSelector,
  connectPaypalInProgress: getConnectPaypalInProgressSelector,
  connectedToStripeAccount: connectedToStripeAccountSelector,
  connectStripeInProgress: getConnectStripeInProgressSelector,

  // auth related
  authenticatedUser: getAuthenticatedUserSelector,
  isHost: isHostOfCollectiveSelector,

  // other
  i18n: getI18nSelector,
});

export default connect(mapStateToProps, {

})(Settings);

Settings.propTypes = {
  user: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
}