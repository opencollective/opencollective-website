import React from 'react';
import DonationPicker from '../DonationPicker';
import DonationDistributor from './DonationDistributor';

export default class AmountPicker extends React.Component {
  render() {
    const {
      group,
      donationForm,
      appendDonationForm,
      tier,
      i18n,
    } = this.props;

    donationForm[tier.name] = donationForm[tier.name] || {};
    const stripeKey = group.stripeAccount && group.stripeAccount.stripePublishableKey;
    const amount = donationForm[tier.name].amount !== undefined ? donationForm[tier.name].amount : tier.range[0];
    const frequency = donationForm[tier.name].frequency || tier.interval;
    const currency = donationForm[tier.name].currency || group.currency;
    const hasPaypal = group.hasPaypal;
    const hasStripe = stripeKey && amount !== '';
    const collectives = [
      {name: group.name, logo: group.logo},
      // A single collective disables sliders, to see sliders in action, uncomment the lines below:
      // NOTE: Use `value` property to specify initial percentage, the value should be a number 
      // between 0 and 1, all collectives value must sum up to 1.
      //
      // {name: 'Donation to Hackers & Founders', value: .25}, 
      // {name: 'Donation to H/F UX', value: .25},
      // {name: 'Donation to Hackers Garage', value: .25}
    ];

    return (
      <div>
        {tier.presets && (
          <DonationPicker
            value={amount}
            currency={currency}
            frequency={frequency}
            presets={tier.presets}
            i18n={i18n}
            onChange={({amount, frequency, currency}) => appendDonationForm(tier.name, {amount, frequency, currency})}
            // MAJOR HACK to support a donation for this group.
            showCurrencyPicker={group.id == 10}/>
        )}
        <DonationDistributor 
          amount={amount}
          method={(hasPaypal) ? 'paypal' : (hasStripe) ? 'stripe' : 'paypal'}
          frequency={frequency}
          editable={true}
          feesOnTop={true}
          collectives={collectives}
          {...this.props}
        />
      </div>
    );
  }
}
