import React from 'react';
import classnames from 'classnames';

import {currencySymbolLookup} from '../lib/format_currency';
import Currency from './Currency';
import Input from './Input';
import Select from './Select';

export default ({value, currency, frequency, presets, onChange, showCurrencyPicker, i18n}) => {
  const presetAmounts = presets;

  if (presets.indexOf('other') === -1){
    presetAmounts.push('other');
  }

  const isCustomMode = (presetAmounts.indexOf(value) === -1);

  function className(selectedPreset, value) {
    return classnames({
      'DonationPicker-amount flex items-center justify-center mr1 circle -ff-sec': true,
      'DonationPicker-amount--selected -fw-bold': (selectedPreset === value) || (selectedPreset === 'other' && isCustomMode)
    });
  }

  function presetListItem(presetLabel) {
    let amountLabel, amountValue;
    if (presetLabel === 'other') {
      amountValue = '100';
      amountLabel = i18n.getString('other');
    } else {
      amountValue = presetLabel;
      amountLabel = (<Currency value={amountValue*100} currency={currency} precision={0} colorify={false} />);
    }

    return (
      <li
        className={className(presetLabel, value)}
        key={presetLabel}
        // need to set this back to the initial frequency of the presets if you flip back from 'Other' control
        onClick={() => onChange({amount:amountValue, frequency}) }>
        {amountLabel}
      </li>
    );

  }

  return (
    <div className='DonationPicker mb3'>
      <ul className='DonationPicker-presets list-reset m0 flex flex-wrap justify-center px1'>
        {presetAmounts.map(presetListItem)}
      </ul>
      <div className='px3'>
        {isCustomMode && customField({onChange, value, frequency, currency, showCurrencyPicker, i18n})}
      </div>
    </div>
  );
};

function customField({onChange, value, frequency, currency, showCurrencyPicker, i18n}) {
  const frequencies = [{
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
          value={value}
          placeholder='Enter an amount'
          customClass='DonationPicker-input'
          handleChange={(amount) => onChange({amount})} />
      </div>
      <div className='col col-6 pl2'>
        <label className='mb1 h6 block left-align'>{i18n.getString('interval')}</label>
        <Select
          options={frequencies}
          value={frequency}
          handleChange={frequency => onChange({frequency})} />
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
