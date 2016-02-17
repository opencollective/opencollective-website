import React from 'react';
import classnames from 'classnames';

import Currency from './Currency';
import Input from './Input';
import Select from './Select';

export default ({value, currency, frequency, onChange, showCurrencyPicker}) => {
  const presetAmounts = [1, 5, 10, 20, 50, 'other'];

  const isCustomMode = (presetAmounts.indexOf(value) === -1);

  function className(selectedPreset, value) {
    return classnames({
      'DonationPicker-amount': true,
      'DonationPicker-amount--selected': (selectedPreset === value) || (selectedPreset === 'other' && isCustomMode)
    });
  }

  function presetListItem(presetLabel) {
    var amountLabel, amountValue;
    if(presetLabel === 'other') {
      amountValue = '100';
      amountLabel = "Other";
    }
    else {
      amountValue = presetLabel;
      amountLabel = (<Currency value={amountValue} currency={currency} precision={0} colorify={false} />);
    }

    return (
      <li
        className={className(presetLabel, value)}
        key={presetLabel}
        onClick={() => onChange({amount:amountValue}) }>
        <label>{amountLabel}</label>
      </li>
    );

  }

  return (
    <div className='DonationPicker'>
      <ul className='DonationPicker-presets'>
        {presetAmounts.map(presetListItem)}
      </ul>
      <div>
        {isCustomMode && customField({onChange, value, frequency, currency, showCurrencyPicker})}
      </div>
    </div>
  );
};

function customField({onChange, value, frequency, currency, showCurrencyPicker}) {
  const frequencies = [{
    label: 'Monthly',
    value: 'month'
  }, {
    label: 'Yearly',
    value: 'year'
  }, {
    label: 'One time',
    value: 'one-time'
  }];

  var currencies = [{
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
    <div className='DonationPicker-customfield'>
      <Input
        value={value}
        placeholder='Enter an amount'
        customClass='DonationPicker-input'
        handleChange={(amount) => onChange({amount})} />
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
  );
}