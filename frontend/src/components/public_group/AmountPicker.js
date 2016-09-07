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
      {id: group.id, name: group.name, logo: group.logo},
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
          amount={Number(amount)}
          method={(hasPaypal) ? 'paypal' : (hasStripe) ? 'stripe' : 'paypal'}
          currency={currency}
          frequency={frequency}
          editable={true}
          optionalComission={false}
          feesOnTop={false}
          collectives={collectives}
          buttonLabel={tier.button}
          skipModal={!(group.settings && group.settings.DonationDistributor)}
          showDisclaimer={true}
          {...this.props}
        />
      </div>
    );
  }
}
