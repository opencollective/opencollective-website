import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { pushState } from 'redux-router';

// containers
import LoginTopBar from './LoginTopBar';
import Notification from './Notification';

// components
import NotFound from '../components/NotFound';
import Grid, { Column } from '../components/Grid';
import PublicFooter from '../components/PublicFooter';
import UserSettingsForHost from '../components/settings/UserSettingsForHost';

// actions
import fetchProfile from '../actions/profile/fetch_by_slug';

// libs
import { canEditUser } from '../lib/admin';
import { getUrlHash, setUrlHash } from '../lib/utils';

// selectors
import { getI18nSelector } from '../selectors/collectives';
import { 
  getCurrentUserProfileSelector } from '../selectors/users';
import { 
  getSessionSelector } from '../selectors/session';
import { getSlugSelector } from '../selectors/router';


export class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userSettingsPages: ['host'],
      currentPage: ''
    }
  }

  componentWillMount() {
    const {
      profile,
      fetchProfile,
      slug
    } = this.props;

    const {
      userSettingsPages
    } = this.state;

    if (!profile) {
      fetchProfile(slug)
    }

    const urlHash = getUrlHash();
    const validUrlHash = userSettingsPages.indexOf(urlHash) !== -1;

    this.setState({
      userSettingsPages,
      currentPage: validUrlHash ? urlHash : userSettingsPages[0],
    });
  }

  render() {
    const {
      profile,
      session,
      i18n
    } = this.props;

    const {
      userSettingsPages,
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
          <div className='SettingsHead' style={{backgroundImage: 'url(/public/images/default-settings-background.png)'}}>
            <img className='SettingsHeadLogo' src={profile.avatar} />
          </div>
          <Grid flex>
            <Column>
              <div className='SettingsNavHeader'>Your Settings</div>
              <div className='SettingsNav'>
                {userSettingsPages.map(pageName => {
                  return (
                    <div
                      key={pageName}
                      className={`SettingsNavItem ${currentPage === pageName ? 'SettingsNavItem--active' : ''}`}
                      onClick={() => {
                        this.setState({currentPage: pageName});
                        setUrlHash(pageName);
                      }}
                      >{pageName}
                    </div>
                    );
                })}
              </div>
            </Column>
            <Column auto>
              <div className='SettingsPage'>
                {currentPage === 'host' && 
                  <UserSettingsForHost i18n={ i18n } />}
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
  profile: getCurrentUserProfileSelector,
  session: getSessionSelector,
  slug: getSlugSelector,

  i18n: getI18nSelector,
});

export default connect(mapStateToProps , {
  fetchProfile
})(Settings);