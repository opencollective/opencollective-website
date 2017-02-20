import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import {currencySymbolLookup} from '../lib/format_currency';
import Currency from './Currency';
import Input from './Input';
import Select from './Select';

export default class DonationPicker extends Component {

  constructor(props) {
    super(props);
    const { presets, amount, interval } = this.props;

    this.interval = interval.replace(/ly$/,''); // some collectives have their tiers' interval set to 'monthly' or 'yearly'
    this.presetAmounts = presets;

    if (presets.indexOf('other') === -1){
      this.presetAmounts.push('other');
    }

    this.state = { amount, interval, selected: this.presetAmounts[0] };
  }

  className(selectedPreset) {
    return classnames({
      'DonationPicker-amount flex items-center justify-center -ff-sec': true,
      'DonationPicker-amount--selected -fw-bold': (this.state.selected == selectedPreset)
    });
  }

  presetListItem(presetLabel) {
    const { amount, currency, i18n, range } = this.props;
    let amountLabel, amountValue;
    if (presetLabel === 'other') {
      amountValue = range ? range[0] : 50;
      amountLabel = i18n.getString('other');
    } else {
      amountValue = presetLabel;
      amountLabel = (<Currency value={amountValue*100} currency={currency} precision={0} colorify={false} />);
    }

    return (
      <li
        className={this.className(presetLabel, amount)}
        key={presetLabel}
        onClick={() => this.onPresetClick({selected: presetLabel, amount:amountValue, interval: this.interval}) }>
        {amountLabel}
      </li>
    );

  }

  onPresetClick({selected, amount, interval}) {
    this.setState({ amount, interval, selected });
    this.onChange({amount, interval});
  }

  customField({onChange, amount, interval, currency, showCurrencyPicker, i18n}) {
    const intervals = [{
      label: i18n.getString('one-time'),
      value: 'one-time'
    }, {
      label: i18n.getString('monthly'),
      value: 'month'
    }, {
      label: i18n.getString('yearly'),
      value: 'year'
    }];

    const currencies = [{
      label: 'USD',
      value: 'USD'
    }, {
      label: 'EUR',
      value: 'EUR'
    }, {
      label: 'MXN',
      value: 'MXN'
    }];

    return (
      <div className='DonationPicker-customfield width-100 pt3 clearfix'>
        <div className='col col-6 pr2 relative'>
          <label className='h6 block mb1 left-align'>{i18n.getString('customAmount')}</label>
          <Input
            prefix={currencySymbolLookup[currency]}
            value={amount}
            placeholder='Enter an amount'
            customClass='DonationPicker-input'
            handleChange={(amount) => onChange({amount})} />
        </div>
        <div className='col col-6 pl2'>
          <label className='mb1 h6 block left-align'>{i18n.getString('interval')}</label>
          <Select
            options={intervals}
            value={interval}
            handleChange={interval => onChange({interval})} />
          {showCurrencyPicker &&
            (<Select
              customClass='DonationPicker-currencyselector'
              options={currencies}
              value={currency}
              handleChange={currency => onChange({currency})} />
              )}
        </div>
      </div>
    );
  }

  onChange({amount, interval, currency}) {
    this.props.onChange({amount, interval, currency});
  }

  render() {
    const {amount, currency, interval, showCurrencyPicker, i18n} = this.props;

    return (
      <div className='DonationPicker mb3'>
        <ul className='DonationPicker-presets list-reset m0 flex flex-wrap justify-center px1'>
          {this.presetAmounts.map(::this.presetListItem)}
        </ul>
        <div className='px3'>
          {this.state.selected === 'other' && this.customField({onChange: ::this.onChange, amount, interval, currency, showCurrencyPicker, i18n})}
        </div>
      </div>
    );
  }
}

DonationPicker.propTypes = {
  amount: PropTypes.number, // initial amount
  currency: PropTypes.string.isRequired,
  interval: PropTypes.string, // month, year, one-time
  presets: PropTypes.arrayOf(PropTypes.number),
  showCurrencyPicker: PropTypes.bool,
  i18n: PropTypes.object.isRequired,
  onChange: PropTypes.func
}

DonationPicker.defaultTypes = {
  showCurrencyPicker: false
}