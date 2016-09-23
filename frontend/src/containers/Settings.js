import React, { Component } from 'react';
import { connect } from 'react-redux';

import i18n from '../lib/i18n';

import LoginTopBar from '../containers/LoginTopBar';

import Grid, { Column } from '../components/Grid';
import PublicFooter from '../components/PublicFooter';

import SettingsBanking from '../components/settings/SettingsBanking';
import SettingsGeneral from '../components/settings/SettingsGeneral';
import SettingsMailing from '../components/settings/SettingsMailing';
import SettingsSocialIntegration from '../components/settings/SettingsSocialIntegration';

const SETTINGS_PAGES = [
  'general',
  'social integrations',
  'mailing',
  'banking',
];

export class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPage: SETTINGS_PAGES[0]
    };
  }

  render() {
    const { currentPage }  = this.state;
    return (
      <div className='Settings'>
        <LoginTopBar />
        <div className='Settings-container'>
          <div className='SettingsHead'></div>
          <Grid flex>
            <Column>
              <div className='SettingsNavHeader'>Collective Settings</div>
              <div className='SettingsNav'>
                {SETTINGS_PAGES.map(pageName => {
                  return (
                    <div
                      className={`SettingsNavItem ${currentPage === pageName ? 'SettingsNavItem--active' : ''}`}
                      onClick={() => this.setState({currentPage: pageName})}
                      >{pageName}</div>
                  )
                })}
              </div>
            </Column>
            <Column auto>
              <div className='SettingsPage'>
                {currentPage === 'general' && <SettingsGeneral />}
                {currentPage === 'social integrations' && <SettingsSocialIntegration />}
                {currentPage === 'banking' && <SettingsBanking />}
                {currentPage === 'mailing' && <SettingsMailing />}
              </div>
            </Column>
          </Grid>
        </div>
        <PublicFooter />
      </div>
    )
  }
}

export default connect(mapStateToProps, {})(Settings);

function mapStateToProps() {
  return {
    i18n: i18n('en')
  }
}
