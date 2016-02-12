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

  console.log("frequency ", frequency);

  const frequencyHuman = frequency === 'one-time' ? '' : `per ${frequency}`;

  const stripeDescription =  `${formatCurrency(amount, group.currency, { compact: false })} ${frequencyHuman}`;

  return (
    <div className='PublicGroupForm'>
      <h2>Support us with a monthly donation</h2>
      <DonationPicker
        value={amount}
        currency={group.currency}
        frequency={frequency}
        onChange={({amount, frequency}) => appendDonationForm({amount, frequency})} />

      <div className='PublicGroupForm-checkout'>
      {stripeKey ?
        (<StripeCheckout
          token={onToken}
          stripeKey={stripeKey}
          name={group.name}
          currency={group.currency}
          amount={stripeAmount}
          description={stripeDescription}>
          <div className='PublicGroupForm-button'>
            <AsyncButton
              color='green'
              inProgress={inProgress} >
              Donate
            </AsyncButton>
          </div>
        </StripeCheckout>) : (<AsyncButton color='gray' > Donate </AsyncButton>)}
        <div className='PublicGroupForm-disclaimer'>
          By clicking above, you are pledging to support us monthly. We appreciate it! And you can cancel anytime. <a href='https://opencollective.com/faq'>Learn more</a>
        </div>
      </div>
    </div>
  );
}

export default PublicGroupForm;