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
  frequency,
  currency
}) => {

  const frequencyHuman = frequency === 'one-time' ? '' : `per ${frequency}`;

  const stripeDescription =  `${formatCurrency(amount, currency, { compact: false })} ${frequencyHuman}`;

  return (
    <div className='PublicGroupForm'>
      <h2>Support us with a monthly donation</h2>
      <DonationPicker
        value={amount}
        currency={currency}
        frequency={frequency}
        onChange={({amount, frequency, currency}) => appendDonationForm({amount, frequency, currency})}
        // MAJOR HACK to support a donation for this group.
        showCurrencyPicker={group.id == 10}/>

      <div className='PublicGroupForm-checkout'>
      {stripeKey ?
        (<StripeCheckout
          token={onToken}
          stripeKey={stripeKey}
          name={group.name}
          currency={currency}
          amount={stripeAmount}
          description={stripeDescription}>
          <div className='PublicGroupForm-button'>
            <AsyncButton
              color='green'
              inProgress={inProgress} >
              Donate
            </AsyncButton>
          </div>
        </StripeCheckout>) : (<AsyncButton disabled={true} > Donate </AsyncButton>)}
        <div className='PublicGroupForm-disclaimer'>
          By clicking above, you are pledging to support us monthly. We appreciate it! And you can cancel anytime. <a href='https://opencollective.com/faq'>Learn more</a>
        </div>
      </div>
    </div>
  );
}

export default PublicGroupForm;