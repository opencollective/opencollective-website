import React, { Component } from 'react';

import CustomInput from '../CustomInput';

export default class SettingsSocialIntegration extends Component {
  render() {
    return (
      <div className='SettingsSocialIntegration'>
        <div className='SettingsPageH1'>Social Integrations</div>
        <div className='SettingsPageHr'>
          <div>Twitter</div>
        </div>
        <p>Connect your tiwtter account to customize the tweet that will be sent when you get a new backers or sponsors, as well as the  monthly tweet to all your supporters</p>
        <div className='SettingsPageButton' style={{margin: '40px 0'}}>Connect Account</div>
        <div className='SettingsPageHr'>
          <div>Github</div>
        </div>
        <p>Aknowlage all the people that contributes to your repository, they will appear in your collective page but wont be able to aprove expenses</p>
        <div className='SettingsPageButton' style={{margin: '40px 0'}}>Connect Account</div>
        <div className='SettingsPageHr'>
          <div>Meetup</div>
        </div>
        <p>Get the code for embedding an RSVP button for any Meetup. Visitors to your website will be able to RSVP to your event on your website without leaving the page. to get link <a href='#'>click here</a> </p>
        <CustomInput value='' placeholder='RSVP code' />
        <div className='SettingsPageButton' style={{margin: '20px 0'}}>Add RSVP</div>
      </div>
    )
  }
}
