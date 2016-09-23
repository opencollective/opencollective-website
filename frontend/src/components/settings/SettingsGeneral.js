import React, { Component } from 'react';

import CustomSelect from '../CustomSelect';

export default class SettingsGeneral extends Component {
  render() {
    return (
      <div className='SettingsGeneral'>
        <div className='SettingsPageH1'>General</div>
        <div className='SettingsPageHr'>
          <div>Language</div>
        </div>
        <CustomSelect>
          <option>English</option>
          <option>French</option>
          <option>Spanish</option>
        </CustomSelect>
        <div className='SettingsPageHr'>
          <div>Currency</div>
        </div>
        <CustomSelect>
          <option>USD</option>
          <option>EUR</option>
          <option>MXN</option>
        </CustomSelect>
        <div className='SettingsPageButton' style={{marginTop: '40px'}}>Save</div>
      </div>
    )
  }
}
