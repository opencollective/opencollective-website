import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import formatCurrency from '../lib/format_currency';

import DonationPicker from './DonationPicker';
import AsyncButton from './AsyncButton';

const Tiers = ({
  group,
  tiers,
  onToken,
  stripeKey,
  stripeAmount,
  inProgress
}) => {

  const tier = tiers[0];
  const frequency = tier.interval;
  const amount = tier.range[0];
  const button = tier.button;
  
  const frequencyHuman = frequency === 'one-time' ? '' : `per ${frequency.replace(/ly$/,'')}`;
  const amountHuman = formatCurrency(amount, group.currency, { precision: 0 });
  
  const stripeDescription =  `${formatCurrency(amount, group.currency, { compact: false })} ${frequencyHuman}`;
  
  return (
    <div className='Tiers'>
      <h2>{tier.name}</h2>
      <p>{tier.description}</p>
      <div className='Tiers-checkout'>
      {stripeKey ?
        (<StripeCheckout
          token={onToken}
          stripeKey={stripeKey}
          name={group.name}
          currency={group.currency}
          amount={stripeAmount}
          description={stripeDescription}>
          <div className='Tiers-button'>
            <AsyncButton
              color='green'
              inProgress={inProgress} >
              {button}
            </AsyncButton>
          </div>
        </StripeCheckout>) : (<AsyncButton disabled={true} > {button} </AsyncButton>)}
        <div className='Tiers-disclaimer'>

        </div>
      </div>
    </div>
  );
}

export default Tiers;