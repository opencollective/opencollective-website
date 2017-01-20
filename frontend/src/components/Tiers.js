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
    const amount = donationForm[tier.name].amount !== undefined ? donationForm[tier.name].amount : tier.range[0];
    const frequency = donationForm[tier.name].frequency || tier.interval;
    const currency = donationForm[tier.name].currency || collective.currency;

    const frequencyHuman = frequency === 'one-time' ? '' : `${i18n.getString('per')} ${i18n.getString(frequency.replace(/ly$/,''))}`;
    const stripeDescription =  `${formatCurrency((amount * 100), currency, collective.settings.formatCurrency)} ${frequencyHuman}`;
    const button = tier.button || `${i18n.getString('donate')} ${stripeDescription}`;
    const cancellationDisclaimer = (frequency !== 'one-time') ? i18n.getString('cancelAnytime') : "";
    const description = tier.description || i18n.getString(`${tier.name}Description`);

    const mockedPayload = {"amount":"10","frequency":"one-time","currency":"USD","token":{"id":"tok_19dTz2DjPFcHOcTmc66YD53U","object":"token","card":{"id":"card_19dTz2DjPFcHOcTmWfy61v2L","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","cvc_check":"pass","dynamic_last4":null,"exp_month":11,"exp_year":2020,"funding":"credit","last4":"4242","metadata":{},"name":"dfds@fdsdsf.com","tokenization_method":null},"client_ip":"74.73.151.59","created":1484786456,"email":"dfds@fdsdsf.com","livemode":false,"type":"card","used":false}};

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
                value={amount}
                currency={currency}
                frequency={frequency}
                presets={tier.presets}
                i18n={i18n}
                onChange={({amount, frequency, currency}) => appendDonationForm(tier.name, {amount, frequency, currency})}
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
                  frequency,
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
                token={(token) => ::this.onTokenReceived(tier, {amount, frequency, currency, token})}
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

            { window && window.location.hostname === 'localhost' &&
              <button onClick={() => ::this.onTokenReceived(tier, mockedPayload)} >Simulate Donation</button>
            }

            </div>
          </div>

          { host &&
            <div className='DonateDisclaimer'>
              {i18n.getString('disclaimer')} {host.name} {stripeDescription} {i18n.getString('for')} {collective.name}. {cancellationDisclaimer}
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
        interval: 'monthly'
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