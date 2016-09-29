import React, { Component } from 'react';

import Checkbox from '../Checkbox';
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
        <div style={{marginTop: '15px'}}>
          <Checkbox checked={true} /><span className='SettingsPageLabel'>Set as default</span>
        </div>
        <div className='SettingsPageHr'>
          <div>Stripe</div>
        </div>
        <CustomInput value='' placeholder='Stripe account' />
        <div style={{marginTop: '15px'}}>
          <Checkbox checked={false} /><span className='SettingsPageLabel'>Set as default</span>
        </div>
        <div className='SettingsPageButton' style={{marginTop: '40px'}}>Save</div>
      </div>
    )
  }
}
