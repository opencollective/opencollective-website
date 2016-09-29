import React, { Component } from 'react';

import CustomTextArea from '../CustomTextArea';

export default class SettingsMailing extends Component {
  render() {
    return (
      <div className='SettingsMailing'>
        <div className='SettingsPageH1'>Mailing</div>
		<div className='SettingsPageLead' style={{marginTop: '30px'}}>
		Write your “Thanks for donations” e-mail <i>*markdown is supported</i>
		</div>
		<CustomTextArea />
		<div className='SettingsPageButton SettingsPageButton--disabled' style={{marginTop: '40px'}}>Send E-mail</div>
      </div>
    )
  }
}
