import React, { Component } from 'react';

import Checkbox from '../Checkbox';
import CustomInput from '../CustomInput';

export default class SettingsBanking extends Component {

  constructor(props) {
    super(props);
    this.state = {
      defaultAccount: props.defaultAccount || 'paypal',
      paypal: props.paypal || '',
      stripe: props.stripe || '',
    };
    this.onSaveRef = this.onSave.bind(this);
    this.toggleDefaultAccountRef = this.toggleDefaultAccount.bind(this);
  }

  render() {
    const {defaultAccount, paypal, stripe} = this.state;
    const marginTop15px = {marginTop: '15px'};
    const changed = this.hasChanged();
    return (
      <div className='SettingsBanking'>
        <div className='SettingsPageH1'>Banking</div>
        <p>Configure how the collective will receive donations &amp; reinburse funds</p>
        <div className='SettingsPageHr'>
          <div>PayPal</div>
        </div>
        <CustomInput value={paypal} placeholder='PayPal Account' onChange={(v) => this.setState({paypal: v})} />
        <div style={marginTop15px}>
          <Checkbox checked={defaultAccount === 'paypal'} onChange={this.toggleDefaultAccountRef} />
          <span className='SettingsPageLabel'>Set as default</span>
        </div>
        <div className='SettingsPageHr'>
          <div>Stripe</div>
        </div>
        <CustomInput value={stripe} placeholder='Stripe account' onChange={(v) => this.setState({stripe: v})} />
        <div style={marginTop15px}>
          <Checkbox checked={defaultAccount === 'stripe'} onChange={this.toggleDefaultAccountRef} />
          <span className='SettingsPageLabel'>Set as default</span>
        </div>
        <div
          className={`SettingsPageButton ${!changed ? 'SettingsPageButton--disabled' : ''}`}
          style={{marginTop: '40px'}}
          onClick={changed ? this.onSaveRef : null}>Save</div>
      </div>
    )
  }

  hasChanged() {
    const propsDefaultAccount = this.props.defaultAccount || 'paypal';
    const stateDefaultAccount = this.state.defaultAccount;
    const propsPaypal = this.props.paypal || '';
    const statePaypal = this.state.paypal;
    const propsStripe = this.props.stripe || '';
    const stateStripe = this.state.stripe;
    return propsDefaultAccount !== stateDefaultAccount || 
                   propsPaypal !== statePaypal || 
                   propsStripe !== stateStripe;
  }

  onSave() {
    const {onSave} = this.props;
    const {defaultAccount, paypal, stripe} = this.state;
    onSave({defaultAccount, paypal, stripe});
  }

  toggleDefaultAccount() {
    const {defaultAccount} = this.state;
    this.setState({defaultAccount: defaultAccount === 'paypal' ? 'stripe' : 'paypal'});
  }
}
