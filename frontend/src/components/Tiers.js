import React, { Component } from 'react';

import StripeCheckout from 'react-stripe-checkout';
import formatCurrency from '../lib/format_currency';
import UserCard from '../components/UserCard';
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
      donationForm,
      onToken,
      appendDonationForm,
      i18n,
      inProgress,
    } = this.props;

    const stripeKey = group.stripeAccount && group.stripeAccount.stripePublishableKey;
    const { hasPaypal } = group;
    const hasStripe = stripeKey && amount !== '';

    donationForm[tier.name] = donationForm[tier.name] || {};
    const amount = donationForm[tier.name].amount !== undefined ? donationForm[tier.name].amount : tier.range[0];
    const frequency = donationForm[tier.name].frequency || tier.interval;
    const currency = donationForm[tier.name].currency || group.currency;

    const frequencyHuman = frequency === 'one-time' ? '' : `${i18n.getString('per')} ${i18n.getString(frequency.replace(/ly$/,''))}`;
    const stripeDescription =  `${formatCurrency(amount, currency, group.settings.formatCurrency)} ${frequencyHuman}`;
    const button = tier.button || `${i18n.getString('donate')} ${stripeDescription}`;
    const cancellationDisclaimer = (frequency !== 'one-time') ? i18n.getString('cancelAnytime') : "";

    return (
      <div className='Tier' id={tier.name} key={`tier-${tier.name}`}>
        <div className='flex flex-wrap justify-center'>
          {filterUsersByTier(group.backers, tier.name).map((user, index) => <UserCard user={user} key={index} className='m1' i18n={i18n} />)}
        </div>

        <p>{tier.description}</p>

        {tier.presets && (
          <div>
            <DonationPicker
              value={amount}
              currency={currency}
              frequency={frequency}
              presets={tier.presets}
              i18n={i18n}
              onChange={({amount, frequency, currency}) => appendDonationForm(tier.name, {amount, frequency, currency})}
              // MAJOR HACK to support a donation for this group.
              showCurrencyPicker={group.id == 10}/>
        </div>
        )}

        <div className='Tiers-checkout'>
          <div className='Tiers-button'>

          {hasPaypal && (
            <AsyncButton
              color='green'
              inProgress={inProgress}
              onClick={() => onToken({
                amount,
                frequency,
                currency,
                options: {
                  paypal: true
                }
              })} >
              {button}
            </AsyncButton>
          )}

          {hasStripe && !hasPaypal && ( // paypal has priority -> to refactor after prototyping phase
            <StripeCheckout
              token={(token) => onToken({amount, frequency, currency, token})}
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
            </StripeCheckout>
          )}
          </div>
        <div className='PublicGroupForm-disclaimer'>
          {i18n.getString('disclaimer')} {group.host.name} {stripeDescription} {i18n.getString('for')} {group.name}. {cancellationDisclaimer}
        </div>
        </div>
      </div>
    )
  }

  render() {

    const tiers = this.props.tiers || [{
        name: 'backer',
        title: "Backers",
        description: this.props.i18n.getString('defaultTierDescription'),
        presets: [1, 5, 10, 50, 100],
        range: [1, 1000000],
        interval: 'monthly',
        button: this.props.i18n.getString("defaultTierButton")
      }];

    return (
      <div className='Tiers'>
        { tiers.map(this.showTier.bind(this)) }
      </div>
    );
  }
}
