import React from 'react';
import classnames from 'classnames';

import Currency from './Currency';
import Input from './Input';
import Select from './Select';

export default ({value, currency, frequency, onChange}) => {
  const presetAmounts = [5, 10, 20, 50, 'custom'];

  const isCustomMode = (presetAmounts.indexOf(value) === -1);

  function className(selectedPreset, value) {
    return classnames({
      'DonationPicker-amount': true,
      'DonationPicker-amount--selected': (selectedPreset === value) || (selectedPreset === 'custom' && isCustomMode)
    });
  }

  function presetListItem(presetLabel) {
    let amountLabel, amountValue;
    if(presetLabel === 'custom') {
      amountValue = '100';
      amountLabel = "Custom";
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
        {isCustomMode && customField({onChange, value, currency, frequency})}
      </div>
    </div>
  );
};

function customField({onChange, value, frequency}) {
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
  return (
    <div className='DonationPicker-customfield'>
      <Input
        value={value}
        placeholder='Enter a custom amount'
        customClass='DonationPicker-input'
        handleChange={(amount) => onChange({amount})} />
      <Select
        options={frequencies}
        value={frequency}
        handleChange={frequency => onChange({frequency})} />
    </div>
  );
}