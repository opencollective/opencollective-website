import React, { Component, PropTypes } from 'react';

import StripeCheckout from 'react-stripe-checkout';
import formatCurrency from '../lib/format_currency';
import AsyncButton from './AsyncButton';
import DonationPicker from './DonationPicker';
import convertToCents from '../lib/convert_to_cents';

export default class Tiers extends Component {

  onTokenReceived(tier, payload) {
    this.setState({loading: tier.name});
    this.props.onToken(payload)
      .then(() => {
        this.setState({loading: null});
      })
  }

  constructor(props) {
    super(props);
    this.state = { };
  }

  showTier(tier) {
    const {
      collective,
      host,
      donationForm,
      appendDonationForm,
      i18n
    } = this.props;

    const inProgress = this.state.loading === tier.name;

    const stripeKey = collective.stripeAccount && collective.stripeAccount.stripePublishableKey;
    const { hasPaypal } = collective;
    const hasStripe = stripeKey && amount !== '';

    donationForm[tier.name] = donationForm[tier.name] || {};
    const amount = donationForm[tier.name].amount !== undefined ? donationForm[tier.name].amount : tier.range[0] || tier.amount;
    const interval = donationForm[tier.name].interval || tier.interval;
    const currency = donationForm[tier.name].currency || collective.currency;

    const intervalHuman = interval === 'one-time' ? '' : `${i18n.getString('per')} ${i18n.getString(interval.replace(/ly$/,''))}`;
    const stripeDescription =  `${formatCurrency((amount * 100), currency, collective.settings.formatCurrency)} ${intervalHuman}`;
    const button = tier.button || `${i18n.getString(tier.verb || 'donate')} ${stripeDescription}`;
    const cancellationDisclaimer = (interval !== 'one-time') ? i18n.getString('cancelAnytime') : "";
    const description = tier.description || i18n.getString(`${tier.name}Description`);

    return (
      <div className='Tier' id={tier.name} key={`${tier.name}`}>
        <div className='Tier-container'>

          <h3 className='Tier-title h3 mt0'>
            <span className='bg-light-gray px2 -fw-ultra-bold'>{i18n.getString('becomeA')} {tier.name}</span>
          </h3>

          <p className='Tier-description'>
            {description}
          </p>

          {tier.presets &&
              <DonationPicker
                amount={amount}
                currency={currency}
                interval={interval}
                presets={tier.presets}
                i18n={i18n}
                onChange={({amount, interval, currency}) => appendDonationForm(tier.name, {amount, interval, currency})}
                // MAJOR HACK to support a donation for this collective.
                showCurrencyPicker={collective.id == 10}/>
          }

          <div className='Tiers-checkout'>
            <div className='Tiers-button'>

            {hasPaypal &&
              <AsyncButton
                color='green'
                inProgress={inProgress}
                onClick={() => ::this.onTokenReceived(tier, {
                  amount,
                  interval,
                  currency,
                  options: {
                    paypal: true
                  }
                })} >
                {button}
              </AsyncButton>
            }
            {hasStripe && !hasPaypal && ( // paypal has priority -> to refactor after prototyping phase
              <StripeCheckout
                token={(token) => ::this.onTokenReceived(tier, {amount, interval, currency, token})}
                stripeKey={stripeKey}
                name={collective.name}
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
          </div>

          { host &&
            <div className='DonateDisclaimer'>
              {i18n.getString('disclaimer')} {host.name} <strong>{stripeDescription}</strong> {i18n.getString('for')} {collective.name}. {cancellationDisclaimer}
            </div>
          }

        </div>
      </div>
    )
  }

  render() {
    const tiers = this.props.tiers || [{
        name: 'backer',
        presets: [2, 5, 10, 50, 100],
        range: [2, 1000000],
        interval: 'month'
      }];

    return (
      <div className='Tiers'>
        { tiers.map(this.showTier.bind(this)) }
      </div>
    );
  }
}

Tiers.propTypes = {
  tiers: PropTypes.arrayOf(PropTypes.object).isRequired,
  collective: PropTypes.object.isRequired,
  host: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  donationForm: PropTypes.object.isRequired,
  appendDonationForm: PropTypes.func.isRequired,
  onToken: PropTypes.object.isRequired
}