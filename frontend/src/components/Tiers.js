import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import formatCurrency from '../lib/format_currency';
import UsersList from '../components/UsersList';
import AsyncButton from './AsyncButton';
import filterCollection from '../lib/filter_collection';

const filterUsersByTier = (users, tiername) => {
  return filterCollection(users, { tier: tiername });
}

const Tiers = ({
  group,
  users,
  tiers,
  onToken,
  stripeKey,
  stripeAmount,
  inProgress
}) => {

  const showTier = (tier) => {

    const frequency = tier.interval;
    const amount = tier.range[0];
    const frequencyHuman = frequency === 'one-time' ? '' : `per ${frequency.replace(/ly$/,'')}`;
    const stripeDescription =  `${formatCurrency(amount, group.currency, { compact: false })} ${frequencyHuman}`;
    const button = tier.button;

    return (
      <div className='Tier'>
        <h2>{tier.name}</h2>
        
        <UsersList users={filterUsersByTier(users, tier.name)} />

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
        </div>
      </div>
    )
  };

  return (
    <div className='Tiers'>
      { tiers.map(showTier) }
    </div>
  );
}

export default Tiers;