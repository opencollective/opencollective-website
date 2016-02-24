import React, { Component } from 'react';

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

export default class Tiers extends Component {

  showTier(tier) {
    const {
      group,
      backers,
      form,
      onToken,
      appendDonationForm,
      inProgress,
    } = this.props;

    const stripeKey = group.stripeAccount && group.stripeAccount.stripePublishableKey;

    form[tier.name] = form[tier.name] || {};
    const amount = form[tier.name].amount || tier.range[0];
    const frequency = form[tier.name].frequency || tier.interval;
    const currency = form[tier.name].currency || group.currency;

    const frequencyHuman = frequency === 'one-time' ? '' : `per ${frequency.replace(/ly$/,'')}`;
    const stripeDescription =  `${formatCurrency(amount, currency, { compact: false })} ${frequencyHuman}`;
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
              onChange={({amount, frequency, currency}) => appendDonationForm(tier.name, {amount, frequency, currency})}
              // MAJOR HACK to support a donation for this group.
              showCurrencyPicker={group.id == 10}/>
        </div>
        )}

        <div className='Tiers-checkout'>
          <div className='Tiers-button'>
          {stripeKey ?
            (<StripeCheckout
              token={(token) => onToken(amount, frequency, currency, token)}
              stripeKey={stripeKey}
              name={group.name}
              currency={currency}
              amount={convertToCents(amount)}
              description={stripeDescription}>
                <AsyncButton
                  color='green'
                  inProgress={inProgress} >
                  {button}
                </AsyncButton>
            </StripeCheckout>) : (<AsyncButton disabled={true} > {button} </AsyncButton>)}
            </div>
        <div className='PublicGroupForm-disclaimer'>
          By clicking above, you are pledging to give {group.host.name} {stripeDescription} for {group.name}. {cancellationDisclaimer}
        </div>
        </div>
      </div>
    )
  };

  render() {

    const tiers = this.props.tiers || [{
        name: 'backer',
        title: "Backers",
        description: "Support us with a monthly donation and help us continue our activities.",
        presets: [1, 5, 10, 50, 100],
        range: [1, 1000000],
        interval: 'monthly',
        button: "Become a backer"
      }];

    return (
      <div className='Tiers'>
        { tiers.map(this.showTier.bind(this)) }
      </div>
    );
  }
}
