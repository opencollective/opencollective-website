import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import formatCurrency from '../lib/format_currency';

import DonationPicker from './DonationPicker';
import AsyncButton from './AsyncButton';

const PublicGroupForm = ({
  group,
  amount,
  appendDonationForm,
  onToken,
  stripeKey,
  stripeAmount,
  inProgress,
  frequency
}) => {

  const frequencyHuman = frequency === 'one-time' ? '' : `per ${frequency}`;

  let stripeDescription =  `${formatCurrency(amount, group.currency, { compact: false })} ${frequencyHuman}`;


  return (
    <div className='PublicGroupForm'>
      <h2>Make your donation</h2>
      <DonationPicker
        value={amount}
        currency={group.currency}
        frequency={frequency}
        onChange={({amount, frequency}) => appendDonationForm({amount, frequency})}
        />

      <StripeCheckout
        token={onToken}
        stripeKey={stripeKey}
        name={group.name}
        currency={group.currency}
        amount={stripeAmount}
        description={stripeDescription}>
        <div className='u-center'>
          <AsyncButton
            color='green'
            inProgress={inProgress} >
            Donate
          </AsyncButton>
        </div>
      </StripeCheckout>
    </div>
  );
}

export default PublicGroupForm;
