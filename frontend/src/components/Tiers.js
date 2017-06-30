import React, { Component, PropTypes } from 'react';

import StripeCheckout from 'react-stripe-checkout';
import formatCurrency from '../lib/format_currency';
import AsyncButton from './AsyncButton';
import DonationPicker from './DonationPicker';
import convertToCents from '../lib/convert_to_cents';
import marked from 'marked';

export default class Tiers extends Component {

  onTokenReceived(tier, payload) {
    this.setState({loading: tier.name});
    payload.description = tier.description;
    this.props.onToken(payload)
      .then(() => {
        this.setState({loading: null});
      })
  }

  constructor(props) {
    super(props);
    this.state = { 
      applePay: false
    };
  }

  componentWillMount(props) {
    const { collective } = this.props;
    if (collective.stripeAccount && collective.stripeAccount.stripePublishableKey) {
      Stripe.setPublishableKey && Stripe.setPublishableKey(collective.stripeAccount.stripePublishableKey);
      Stripe.applePay && Stripe.applePay.checkAvailability(available => this.setState({applePay: available}));
    }
  }

  rawMarkup(text) {
    const rawMarkup = (text) ? marked(text, {sanitize: true}) : '';

    return { __html: rawMarkup };
  }

  showTier(tier) {
    const {
      collective,
      host,
      donationForm,
      appendDonationForm,
      i18n
    } = this.props;

    const {
      applePay
    } = this.props;

    const inProgress = this.state.loading === tier.name;

    const stripeKey = collective.stripeAccount && collective.stripeAccount.stripePublishableKey;
    const { hasPaypal } = collective;
    const hasStripe = stripeKey && amount !== '';

    donationForm[tier.name] = donationForm[tier.name] || {};

    let amount;
    if (donationForm[tier.name].amount !== undefined) {
      amount = donationForm[tier.name].amount;
    } else if (tier.amount) {
      amount = tier.amount;
    } else if (tier.presets) {
      amount = (!isNaN(tier.presets[0]) && tier.presets[0]) || (!isNaN(tier.presets[1]) && tier.presets[1]);
    } else {
      amount = tier.range[0];
    }

    const interval = donationForm[tier.name].interval || tier.interval || 'one-time';
    const currency = donationForm[tier.name].currency || collective.currency;

    const intervalHuman = interval === 'one-time' ? '' : `${i18n.getString('per')} ${i18n.getString(interval.replace(/ly$/,''))}`;
    const stripeDescription =  `${formatCurrency((amount * 100), currency, collective.settings.formatCurrency)} ${intervalHuman}`;
    const button = tier.button || `${i18n.getString(tier.verb || 'donate')} ${stripeDescription}`;
    const cancellationDisclaimer = (interval !== 'one-time') ? i18n.getString('cancelAnytime') : "";
    const description = tier.description || i18n.getString(`${tier.name}Description`);
    const title = tier.title || `${i18n.getString('becomeA')} ${tier.name}`;

    console.log('applePay available: ', this.state.applePay)
    return (
      <div className='Tier' id={tier.name} key={`${tier.name}`}>
        <div className='Tier-container'>

          <h3 className='Tier-title h3 mt0'>
            <span className='bg-color px2 -fw-ultra-bold'>{title}</span>
          </h3>

          <div className='Tier-description' dangerouslySetInnerHTML={ this.rawMarkup(description)} />

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
                bitcoin={collective.settings.bitcoin}
                amount={convertToCents(amount)}
                description={stripeDescription}>
                  <AsyncButton
                    color='green'
                    inProgress={inProgress} >
                    {button}
                  </AsyncButton>
              </StripeCheckout>
            )}

            {hasStripe && !hasPaypal && this.state.applePay && (
              <button onClick={() => this.beginApplePay(tier, {amount, interval, currency})} id="apple-pay-button"></button>
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

  beginApplePay(tier, payload) {
    const { collective, onToken } = this.props;
    const paymentRequest = {
      countryCode: 'US',
      currencyCode: collective.currency,
      total: {
        label: `${collective.name} - Open Collective`,
        amount: payload.amount
      },
      requiredShippingContactFields: ['email']
    }
    const session = Stripe.applePay.buildSession(paymentRequest,
      (result, completion) => {
        payload.description = tier.description;
        payload.token = { id: result.token.id, email: result.shippingContact.emailAddress };
        return onToken(payload)
          .then(() => completion(ApplePaySession.STATUS_SUCCESS))
          .catch(err => completion(ApplePaySession.STATUS_FAILURE));
        }, error => notify('error', error.message));
    session.oncancel = () => console.log('User hit cancel button');
    session.begin();
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