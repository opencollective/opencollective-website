import React, { Component } from 'react';

import PaypalPreapprovalContainer from '../../containers/PaypalPreapprovalContainer';
import StripeAuthContainer from '../../containers/StripeAuthContainer';

export default class UserSettingsForHost extends Component {

  render() {
    const {
      i18n
    } = this.props;

    return (
      <div className='SettingsSection'>
        <div className='SettingsPageH1'>Host Settings</div>
        <p>{i18n.getString('settingsHostHeader')}</p>
        <div className='SettingsPageHr'>
          <div>PayPal</div>
        </div>
        <PaypalPreapprovalContainer />
        <div className='SettingsPageHr'>
          <div>Stripe</div>
        </div>
        <StripeAuthContainer />
      </div>
    )
  }
}