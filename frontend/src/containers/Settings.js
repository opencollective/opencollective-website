import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// containers
import LoginTopBar from './LoginTopBar';
import Notification from './Notification';

// components
import NotFound from '../components/NotFound';
import Grid, { Column } from '../components/Grid';
import PublicFooter from '../components/PublicFooter';
import UserSettingsForHost from '../components/settings/UserSettingsForHost';

// actions
import confirmPreapprovalKey from '../actions/users/confirm_preapproval_key';
import getApprovalKey from '../actions/users/get_approval_key';

// libs
import { canEditUser } from '../lib/admin';
import { getUrlHash, setUrlHash } from '../lib/utils';

// selectors
import { getPopulatedCollectiveSelector } from '../selectors/collectives';
import { 
  getCurrentUserProfileSelector,
  getPaypalCardSelector,
  getConnectPaypalInProgressSelector } from '../selectors/users';
import { getSessionSelector } from '../selectors/session';
import { getPaypalQueryFieldsSelector } from '../selectors/router';


export class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      settingsPages: [],
      currentPage: ''
    }
  }

  componentWillMount() {
    const {
      profile
    } = this.props;

    let settingsPages = [];

    if (profile) {
      settingsPages = ['host'];
    }

    const urlHash = getUrlHash();
    const validUrlHash = settingsPages.indexOf(urlHash) !== -1;

    this.setState({
      settingsPages,
      currentPage: validUrlHash ? urlHash : settingsPages[0],
    });
  }

  render() {
    const {
      collective,
      profile,
      session
    } = this.props;

    const {
      settingsPages,
      currentPage
    } = this.state;

    if (!profile || !canEditUser(session, profile)) {
      return <NotFound />
    }

    return (
      <div className='Settings'>
        <LoginTopBar />
        <Notification />

        <div className='Settings-container'>
          <Grid flex>
            <Column>
              <div className='SettingsNavHeader'>Your Settings</div>
              <div className='SettingsNav'>
                {settingsPages.map(pageName => {
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
                {currentPage === 'host' && <UserSettingsForHost />}
              </div>
            </Column>
          </Grid>
        </div>
        <PublicFooter />
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  collective: getPopulatedCollectiveSelector,
  profile: getCurrentUserProfileSelector,
  session: getSessionSelector,

  // Paypal
  paypalCard: getPaypalCardSelector,
  paypalQueryFields: getPaypalQueryFieldsSelector,
  connectPaypalInProgress: getConnectPaypalInProgressSelector,

  // Stripe
});

export default connect(mapStateToProps , {
  getApprovalKey,
  confirmPreapprovalKey
})(Settings);