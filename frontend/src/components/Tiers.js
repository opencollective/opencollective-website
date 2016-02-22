import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import formatCurrency from '../lib/format_currency';
import UsersList from '../components/UsersList';
import AsyncButton from './AsyncButton';
import filterCollection from '../lib/filter_collection';
import DonationPicker from './DonationPicker';
import convertToCents from '../lib/convert_to_cents';

const filterUsersByTier = (users, tiername) => {
  return filterCollection(users, { tier: tiername });
}

const Tiers = ({
  group,
  backers,
  tiers,
  amount,
  currency,
  frequency,
  onToken,
  appendDonationForm,
  inProgress
}) => {
  
  const stripeKey = group.stripeAccount && group.stripeAccount.stripePublishableKey;

  if(!tiers) {
    tiers = [{
      name: null,
      title: "Backers",
      description: "Support us with a monthly donation and help us continue our activities.",
      presets: [1, 5, 10, 50, 100],
      range: [1, 1000000],
      interval: 'monthly',
      button: "Become a backer"
    }];
  }

  const showTier = (tier) => {
    frequency = frequency || tier.interval;
    amount = amount || tier.range[0];
    const frequencyHuman = frequency === 'one-time' ? '' : `per ${frequency.replace(/ly$/,'')}`;
    const stripeDescription =  `${formatCurrency(amount, group.currency, { compact: false })} ${frequencyHuman}`;
    const button = tier.button;
    const cancellationDisclaimer = (frequency !== 'one-time') ? "You can cancel anytime." : "";

    return (
      <div className='Tier'>
        <h2>{tier.title || tier.name}</h2>
        
        <UsersList users={filterUsersByTier(backers, tier.name)} />

        <p>{tier.description}</p>

        {tier.presets && (
          <div>
            <DonationPicker
              value={amount}
              currency={currency}
              frequency={frequency}
              presets={tier.presets}
              onChange={({amount, frequency, currency}) => appendDonationForm({amount, frequency, currency})}
              // MAJOR HACK to support a donation for this group.
              showCurrencyPicker={group.id == 10}/>
         </div>
        )}

        <div className='Tiers-checkout'>
        {stripeKey ?
          (<StripeCheckout
            token={onToken}
            stripeKey={stripeKey}
            name={group.name}
            currency={group.currency}
            amount={convertToCents(amount)}
            description={stripeDescription}>
            <div className='Tiers-button'>
              <AsyncButton
                color='green'
                inProgress={inProgress} >
                {button}
              </AsyncButton>
            </div>
          </StripeCheckout>) : (<AsyncButton disabled={true} > {button} </AsyncButton>)}
        <div className='PublicGroupForm-disclaimer'>
          By clicking above, you are pledging to give {group.host.name} {stripeDescription} for {group.name}. {cancellationDisclaimer} <a href='https://opencollective.com/faq'>Learn more</a>
        </div>
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