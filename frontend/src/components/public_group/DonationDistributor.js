import React, { Component, PropTypes } from 'react';

import formatCurrency, {currencySymbolLookup} from '../../lib/format_currency';
import convertToCents from '../../lib/convert_to_cents';

import StripeCheckout from 'react-stripe-checkout';
import AsyncButton from '../AsyncButton';
import DonationDistributorItem from './DonationDistributorItem';

const RADIO_ON = '/static/images/radio-btn-on.svg';
const RADIO_OFF = '/static/images/radio-btn-off.svg';
const CC_FIXED_FEE = 0.30;
const CC_RELATIVE_FEE = 2.9/100;

export default class DonationDistributor extends Component {

  static propTypes = {
    amount: PropTypes.number.isRequired,
    buttonLabel: PropTypes.string,
    collectives: PropTypes.arrayOf(React.PropTypes.object).isRequired,
    currency: PropTypes.string.isRequired,
    editable: PropTypes.bool,
    feesOnTop: PropTypes.bool,
    frequency: PropTypes.string.isRequired,
    group: PropTypes.object.isRequired,
    method: PropTypes.oneOf(['paypal', 'stripe']),
    optionalCommission: PropTypes.bool,
    skipModal: PropTypes.bool,
  }

  static defaultProps = {
    editable: false,
    feesOnTop: false,
    method: 'stripe',
    optionalCommission: false,
    skipModal: true,
  }

  constructor(props) {
    super(props);
    const {group, method, amount, optionalCommission} = this.props;
    this.stripeKey = (group.stripeAccount && group.stripeAccount.stripePublishableKey) ? group.stripeAccount.stripePublishableKey : '';
    const hasPaypal = group.hasPaypal;
    const hasStripe = this.stripeKey && amount;
    this.state = {
      disabled: !hasPaypal && !hasStripe,
      paymentMethod: method,
      commissionPercentage: optionalCommission ? 50 : 100,
      ocCommission: optionalCommission ? 0.20 : 0.05,
      optionalPaymentMethod: hasStripe && hasPaypal,
      distributionAltered: false
    };
    this.resetDistribution();
  }

  renderDonateButton() {
    const {i18n, buttonLabel} = this.props;
    const {disabled} = this.state;
    const buttonClassName = `Button ${disabled ? 'Button--disabled': 'Button--green'}`;
    return (
      <div className='DonationDistributor-donate-button max-width-1 mx-auto'>
        <div className={buttonClassName} onClick={disabled ? Function.prototype : this.open.bind(this)}>
          {buttonLabel || i18n.getString('donate')}
        </div>
      </div>
    )
  }

  renderCollectives() {
    const {currency} = this.props;
    const options = this.options;
    return options.map(
      (option, index) => {
        return (
          <DonationDistributorItem
            currency={currency}
            key={index}
            label={option.label}
            icon={option.icon}
            editable={options.length > 1 && option.editable}
            value={option.value * 100}
            amount={this.getNetDonation()}
            onChange={(percent, prev) => {
              const delta = Math.abs(prev - percent) / 100;
              if (prev - percent < 0) {
                option.value += delta;
                this.redistribute('remove', option, delta);
              } else {
                option.value -= delta;
                this.redistribute('add', option, delta);
              }
              this.setState({distributionAltered: true});
            }}
          />
        )
      }
    )
  }

  renderSubtotal() {
    const {i18n, currency} = this.props;
    return (
      <DonationDistributorItem
        className='-no-dashed-bg -bold-amount -bold-label --subtotal'
        currency={currency}
        label={i18n.getString('subtotal')}
        amount={this.getNetDonation()}
      />
    )
  }

  renderPlatformFee() {
    const {optionalCommission, currency, i18n} = this.props;
    const {commissionPercentage, ocCommission} = this.state;
    const platformFeeMultiplier = this.getPlatformFeeMultiplier();
    const customPlatformFeePercentage = (platformFeeMultiplier * 100).toFixed(1).replace('.0', '');
    return (
      <div>
        <DonationDistributorItem
          className='-no-dashed-bg'
          currency={currency}
          label={`${i18n.getString('ocCommission')} ${customPlatformFeePercentage}%`}
          editable={optionalCommission}
          editableAmount={optionalCommission}
          amount={this.getChargeAmount() * ocCommission}
          value={commissionPercentage}
          onChange={percent => this.setState({commissionPercentage: percent})}
        />
      </div>
    )
  }

  renderHostFee() {
    const {group, currency, i18n} = this.props;
    return (
      <div>
        <DonationDistributorItem
          className='-no-dashed-bg'
          currency={currency}
          label={`${i18n.getString('hostFee')} ${group.hostFeePercent}%`}
          amount={this.getHostFeeAmount()}
        />
      </div>
    )
  }

  renderMethodPicker() {
    const {currency, i18n} = this.props;
    const {paymentMethod, optionalPaymentMethod} = this.state;
    const formattedProcessingFee = formatCurrency(this.getCreditCardFee(), currency, {compact: true});
    const usingPayPal = paymentMethod === 'paypal';
    const usingStripe = paymentMethod === 'stripe';
    const formattedFixedFee = formatCurrency(CC_FIXED_FEE, currency, {compact: true});
    return (
      <div>
        {(optionalPaymentMethod || usingPayPal) && (
          <div className='DonationDistributorItem-container --paypal' style={{marginTop: 0}} onClick={() => this.setState({paymentMethod: 'paypal'})}>
            <div className='flex'>
              <div className='flex-auto'>
                <div className='flex flex-column'>
                  <div className='flex'>
                    <div style={{display: optionalPaymentMethod ? 'block' : 'none'}}>
                      <img src={paymentMethod === 'paypal' ? RADIO_ON : RADIO_OFF} width='16px' height='16px'/>
                    </div>
                    <div className={`flex-auto left-align ${paymentMethod === 'paypal' ? '-dashed-bg' : ''}`}>
                      <div className='DonationDistributorItem-label' style={{color: paymentMethod === 'paypal' ? '#131313' : '#ccc'}}>
                        PayPal <i>(2.9% + {formattedFixedFee} {i18n.getString('processingFee')})</i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="DonationDistributorItem-amount">
                <span>{paymentMethod === 'paypal' ? formattedProcessingFee : ''}</span>
              </div>
            </div>
          </div>
        )}
        {(optionalPaymentMethod || usingStripe) && (
          <div className='DonationDistributorItem-container --stripe' onClick={() => this.setState({paymentMethod: 'stripe'})}>
            <div className='flex'>
              <div className='flex-auto'>
                <div className='flex flex-column'>
                  <div className='flex'>
                    <div style={{display: optionalPaymentMethod ? 'block' : 'none'}}>
                      <img src={paymentMethod === 'stripe' ? RADIO_ON : RADIO_OFF} width='16px' height='16px'/>
                    </div>
                    <div className={`flex-auto left-align ${paymentMethod === 'stripe' ? '-dashed-bg' : ''}`}>
                      <div className='DonationDistributorItem-label' style={{color: paymentMethod === 'stripe' ? '#131313' : '#ccc'}}>
                        {i18n.getString('creditCard')} <i>(2.9% + {formattedFixedFee} {i18n.getString('processingFee')})</i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="DonationDistributorItem-amount">
                <span>{paymentMethod === 'stripe' ? formattedProcessingFee : ''}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  renderTotal() {
    const {currency, i18n} = this.props;
    return (
      <DonationDistributorItem
        className='-no-dashed-bg -bold-amount -bold-label --total'
        currency={currency}
        label={i18n.getString('total')}
        amount={this.getChargeAmount()}
      />
    )
  }

  renderPaymentButton() {
    const {group, inProgress, currency, frequency, onToken, i18n, buttonLabel, skipModal} = this.props;
    const stripeKey = this.stripeKey;
    const chargeAmount = this.getChargeAmount();
    const amount = chargeAmount.toFixed(2);
    const formattedAmount = formatCurrency(chargeAmount, currency, {compact: true});
    const distribution = this.options.map((opt) => { return {id: opt.id, value: opt.value} });
    const label = skipModal ? (buttonLabel || i18n.getString('donate')) : `${i18n.getString('pay')} ${formattedAmount}`;
    const customButtonStyle = label.length > 30 ? {fontSize: '14px', padding: '14px 16px'} : {};

    if (this.state.paymentMethod === 'paypal') {
      return (
        <AsyncButton
          style={customButtonStyle}
          color='green'
          inProgress={inProgress}
          customClass='btn -btn-big -bg-green -ttu -ff-sec -fw-bold'
          onClick={() => onToken({
            amount,
            frequency,
            currency,
            options: {
              paypal: true,
              distribution
            },
          })}
          >
          {label}
        </AsyncButton>
      )
    } else if (this.state.paymentMethod === 'stripe') {
      return (
        <StripeCheckout
          token={(token) => onToken({
            amount,
            frequency,
            currency,
            token,
            options: {
              distribution
            },
          })}
          stripeKey={stripeKey}
          name={group.name}
          currency={currency}
          amount={convertToCents(amount)}
          description={this.getStripeDesciption()}>
            <AsyncButton
              style={customButtonStyle}
              onClick={this.close.bind(this)}
              color='green'
              inProgress={inProgress}
              customClass='btn -btn-big -bg-green -ttu -ff-sec -fw-bold'>
              {label}
            </AsyncButton>
        </StripeCheckout>
      )
    }
  }

  renderDisclaimer() {
    const {group, i18n, frequency} = this.props;
    const cancellationDisclaimer = (frequency !== 'one-time') ? i18n.getString('cancelAnytime') : '';
    return (
      <h6>
        {i18n.getString('disclaimer')} {group.host.name} {this.getStripeDesciption()} {i18n.getString('for')} {group.name}. {cancellationDisclaimer}
      </h6>
    )
  }

  render() {
    if (this.props.skipModal) {
      if (this.state.disabled) {
        return this.renderDonateButton();
      } else {
        return (
          <div className='DonationDistributor-donate-button max-width-1 mx-auto'>
            {this.renderPaymentButton()}
          </div>
        )
      }
    } else if (!this.state.opened) {
      return this.renderDonateButton();
    }

    const {i18n, group} = this.props;
    const {distributionAltered} = this.state;

    return (
      <div className='DonationDistributor-mask' onClick={this.onMaskClick.bind(this)}>
        <div className='DonationDistributor-container' style={{height: this.options.length > 1 ? undefined : '605px'}}>
          <div className='DonationDistributor-header'>
            <h2>{this.options.length > 1 && this.props.editable ? i18n.getString('youDeciceDistributeYour') : i18n.getString('plzConfirmYour')}</h2>
            <h1>{`${currencySymbolLookup[this.props.currency]}${this.props.amount} ${this.props.frequency} ${i18n.getString('donation')}.`}</h1>
            <small onClick={distributionAltered ? this.resetDistribution.bind(this) : this.close.bind(this)}>
            {distributionAltered ?  i18n.getString('resetDefaultDistribution') : `${i18n.getString('edit')} ${i18n.getString('donation')}`}
            </small>
          </div>
          <div className='DonationDistributor-body'>
            <div className='DonationDistributor-section'>
              {this.renderCollectives()}
            </div>
            <div className='DonationDistributor-hr' style={{marginTop: '30px'}}></div>
            <div className='DonationDistributor-section'>
              {this.options.length > 1 ? this.renderSubtotal() : null}
              {this.renderPlatformFee()}
              {group.hostFeePercent ? this.renderHostFee() : null}
              {this.renderMethodPicker()}
            </div>
            <div className='DonationDistributor-hr'></div>
            <div className='DonationDistributor-section'>{this.renderTotal()}</div>
          </div>
          <div className='DonationDistributor-footer'>
            {this.renderPaymentButton()}
            {this.renderDisclaimer()}
          </div>
        </div>
      </div>
    );
  }

  getChargeAmount() {
    const {amount, feesOnTop, group} = this.props;
    if (!feesOnTop) {
      return amount;
    }
    const hostFee = group.hostFeePercent ? (group.hostFeePercent / 100) : 0;
    return (amount + CC_FIXED_FEE) / (1 - (this.getPlatformFeeMultiplier() + (feesOnTop ? hostFee : 0) + CC_RELATIVE_FEE))
  }

  getPlatformFeeMultiplier() {
    const {commissionPercentage, ocCommission} = this.state;
    return (commissionPercentage / 100) * ocCommission;
  }

  getPlatformFeeAmount() {
    return this.getPlatformFeeMultiplier() * this.getChargeAmount();
  }

  getHostFeeAmount() {
    const {group} = this.props;
    const hostFee = group.hostFeePercent ? (group.hostFeePercent / 100) : 0;
    return hostFee * this.getChargeAmount();
  }

  getCreditCardFee() {
    return CC_FIXED_FEE + (this.getChargeAmount() * CC_RELATIVE_FEE);
  }

  getNetDonation() {
    return this.getChargeAmount() - this.getPlatformFeeAmount() - this.getHostFeeAmount() - this.getCreditCardFee();
  }

  getStripeDesciption() {
    const {i18n, currency, frequency} = this.props;
    const showFeeSeperately = false;
    const frequencyHuman = frequency === 'one-time' ? '' : `${i18n.getString('per')} ${i18n.getString(frequency.replace(/ly$/,''))}`;
    const chargeAmount = this.getChargeAmount();
    if (showFeeSeperately) {
      const processingFee = this.getCreditCardFee();
      const formattedAmount = formatCurrency(chargeAmount - processingFee, currency, { compact: false });
      const formattedProcessingFee = formatCurrency(processingFee, currency, {compact: true});
      const feeDescription = processingFee ? `(+\u00A0${formattedProcessingFee}\u00A0payment\u00A0processing\u00A0fees)` : '';
      return `${formattedAmount} ${frequencyHuman} ${feeDescription}`;
    } else {
      const formattedAmount = formatCurrency(chargeAmount, currency, { compact: false });
      return `${formattedAmount} ${frequencyHuman}`;
    }
  }

  redistribute(action, activeOption, delta) {
    const candidates = this.options.filter((option) => {
      if (activeOption === option) return false;
      if (action === 'add' && option.value >= 1) return false;
      if (action === 'remove' && option.value <= 0) return false;
      return true;
    });
    const count = candidates.length;
    const deltaPiece = delta/count;
    let leftOver = 0;
    candidates.forEach((option) => {
      if (action === 'add') {
        if (option.value + deltaPiece <= 1) {
          option.value += deltaPiece;
        } else {
          leftOver += deltaPiece - (1 - option.value);
          option.value = 1;
        }
      } else if (action === 'remove') {
        if (option.value - deltaPiece >= 0) {
          option.value -= deltaPiece;
        } else {
          leftOver += (deltaPiece - option.value);
          option.value = 0;
        }
      }
    });

    // Set values
    this.options.forEach((option) => {
      const index = candidates.indexOf(option);
      if (index !== -1) {
        option.value = candidates[index].value;
      }
    });

    if (leftOver > 0.000000000000001) {
      this.redistribute(action, activeOption, leftOver);
    } else {
      this.forceUpdate();
    }
  }

  resetOptions() {
    const {optionalCommission} = this.props;
    this.resetDistribution();
    this.setState({commissionPercentage: optionalCommission ? 50 : 100});
  }

  resetDistribution() {
  	const {collectives, editable} = this.props;
    this.options = collectives.map((collective) => {
      return {
        id: collective.id,
        label: collective.name,
        icon: collective.logo,
        editable: editable,
        value: !isNaN(collective.value) ? collective.value : (1 / collectives.length)
      }
    });
    this.forceUpdate();
  }

  onMaskClick(ev) {
    if (ev.currentTarget === ev.target) {
      this.close();
    }
  }

  open() {
    document.body.style.overflow = 'hidden';
    this.resetOptions();
    this.setState({opened: true});
  }

  close() {
    document.body.style.overflow = 'auto';
    this.setState({opened: false});
  }
}
