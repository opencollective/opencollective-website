import React, { Component } from 'react';

import CustomSelect from '../CustomSelect';

const onChange = (value) => {
  console.log('onChange', value);
};

export default class SettingsGeneral extends Component {
  render() {
    return (
      <div className='SettingsGeneral'>
        <div className='SettingsPageH1'>General</div>
        <div className='SettingsPageHr'>
          <div>Language</div>
        </div>
        <CustomSelect onChange={onChange}>
          <option value='en'>English</option>
          <option value='fr'>French</option>
          <option value='es'>Spanish</option>
        </CustomSelect>
        <div className='SettingsPageHr'>
          <div>Currency</div>
        </div>
        <CustomSelect onChange={onChange}>
          <option>USD</option>
          <option>EUR</option>
          <option>MXN</option>
        </CustomSelect>
        <div className='SettingsPageButton' style={{marginTop: '40px'}}>Save</div>
      </div>
    )
  }
}
