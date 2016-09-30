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
    const { settings, currency }  = props.group;
    const urlHash = this.getUrlHash();
    const validUrlHash = SETTINGS_PAGES.indexOf(urlHash) !== -1;
    if (!validUrlHash) this.setUrlHash(SETTINGS_PAGES[0]);
    this.state = {
      currentPage: validUrlHash ? urlHash : SETTINGS_PAGES[0],
      lang: settings.lang,
      currency: currency,
    };
  }

  render() {
    const { currentPage }  = this.state;
    const { group }  = this.props;
    const { settings, currency }  = group;
    return (
      <div className='Settings'>
        <LoginTopBar />
        <div className='Settings-container'>
          <div className='SettingsHead' style={{backgroundImage: `url(${group.backgroundImage})`}}>
            <div className='SettingsHeadLogo' style={{backgroundImage: `url(${group.logo})`}}></div>
          </div>
          <Grid flex>
            <Column>
              <div className='SettingsNavHeader'>Collective Settings</div>
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
                {currentPage === 'general' && <SettingsGeneral currency={currency} language={settings.lang} onSave={console.log.bind(console)}/>}
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

  getUrlHash() {
    return this.props.location.hash ? this.props.location.hash.substr(1).trim().toLowerCase().replace('-', ' ') : '';
  }

  setUrlHash(name) {
    window.location.hash = name.replace(' ', '-');
  }
}

export default connect(mapStateToProps, {})(Settings);

function mapStateToProps({ groups }) {
  const group = groups[ Object.keys(groups)[0] ]; // groups is a object with a single numberic key
  return {
    group,
    i18n: i18n('en')
  }
}
