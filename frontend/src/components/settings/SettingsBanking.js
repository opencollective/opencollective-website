import React, { Component } from 'react';

import CustomInput from '../CustomInput';

export default class SettingsBanking extends Component {
  render() {
    return (
      <div className='SettingsBanking'>
        <div className='SettingsPageH1'>Banking</div>
        <p>Configure how the collective will receive donations &amp; reinburse funds</p>
        <div className='SettingsPageHr'>
          <div>PayPal</div>
        </div>
        <CustomInput value='' placeholder='PayPal Account' />
        <div className='SettingsPageHr'>
          <div>Stripe</div>
        </div>
        <CustomInput value='' placeholder='Stripe account' />
        <div className='SettingsPageButton' style={{marginTop: '40px'}}>Save</div>
      </div>
    )
  }
}
