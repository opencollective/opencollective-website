import React, { Component } from 'react';
import { connect } from 'react-redux';

import i18n from '../lib/i18n';

import LoginTopBar from '../containers/LoginTopBar';
import PublicFooter from '../components/PublicFooter';
import Grid, { Column } from '../components/Grid';

export class Settings extends Component {
  render() {
    // const { params }  = this.props;
    return (
      <div className='Settings'>
        <LoginTopBar />
        <div className='Settings-container'>
          <div className='SettingsHead'></div>
          <Grid flex>
            <Column>
              <div className='SettingsNav'>
                <div className='SettingsNavItem'>General</div>
                <div className='SettingsNavItem'>Social Integrations</div>
                <div className='SettingsNavItem'>Mailing</div>
                <div className='SettingsNavItem'>Banking</div>
              </div>
            </Column>
            <Column auto>
              <div className='SettingsPage'>
                <div className='SettingsPageH1'>General</div>
                <div className='SettingsPageHr'>
                  <div>PayPal</div>
                </div>
                
              </div>
            </Column>
          </Grid>


        Settings
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
