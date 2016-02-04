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
}) => {


  let stripeDescription =  `${formatCurrency(amount, group.currency, { compact: false })} per month`;


  return (
    <div className='PublicGroupForm'>
      <h2>Support us with a monthly donation</h2>
      <DonationPicker
        value={amount}
        currency={group.currency}
        onChange={({amount}) => appendDonationForm({amount})} />

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
        <span className='PublicGroupForm-disclaimer'>
        By clicking above, you are pledging to support us monthly. We appreciate it! And you can cancel anytime. <a href='https://opencollective.com/faq'>Learn more</a>
        </span>
      </StripeCheckout>
    </div>
  );
}

export default PublicGroupForm;