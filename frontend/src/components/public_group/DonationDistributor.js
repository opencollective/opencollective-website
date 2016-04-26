import React, { Component, PropTypes } from 'react';
import DonationDistributorItem from './DonationDistributorItem';
import StripeCheckout from 'react-stripe-checkout';
import AsyncButton from '../AsyncButton';
import formatCurrency from '../../lib/format_currency';
import convertToCents from '../../lib/convert_to_cents';

const RADIO_ON = '/static/images/radio-btn-on.svg';
const RADIO_OFF = '/static/images/radio-btn-off.svg';
const OC_COMMISSION = 0.05;

export default class DonationDistributor extends Component {

  static propTypes = {
    group: PropTypes.object.isRequired,
    method: PropTypes.oneOf(['paypal', 'stripe']),
    amount: PropTypes.number.isRequired,
    collectives: PropTypes.arrayOf(React.PropTypes.object).isRequired,
    editable: PropTypes.bool,
    currency: PropTypes.string.isRequired,
    feesOnTop: PropTypes.bool,
    frequency: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    const {group, method, collectives, amount} = this.props;
    this.stripeKey = group.stripeAccount && group.stripeAccount.stripePublishableKey ? group.stripeAccount.stripePublishableKey : '';
    const hasPaypal = group.hasPaypal;
    const hasStripe = this.stripeKey && amount;

    this.options = this.props.collectives.map((collective) => {
      return {
        label: collective.name, 
        icon: collective.logo, 
        editable: Boolean(props.editable),
        value: 1 / collectives.length
      }
    });

    this.state = {
      disabled: !hasPaypal && !hasStripe,
      paymentMethod: method,
      optionalComission: true,
      includeComission: false,
      optionalPaymentMethod: hasStripe && hasPaypal
    };
  }

  renderDonateButton()
  {
    return (
      <div className='DonationDistributor-donate-button max-width-1 mx-auto'>
        <div 
          className={`Button ${this.state.disabled ? 'Button--disabled': 'Button--green'}`} 
          onClick={this.state.disabled ? Function.prototype : this.open.bind(this)}
        >
          Donate
        </div>
      </div>
    )
  }

  renderCollectives()
  {
    const options = this.options;
    return options.map(
      (option, index) => {
        return (
          <DonationDistributorItem 
            key={index} 
            label={option.label} 
            icon={option.icon} 
            editable={option.editable} 
            value={option.value * 100} 
            amount={this.getDistributableAmount()}
            onChange={(percent, prev) => {
              const delta = Math.abs(prev - percent) / 100;
              if (prev - percent < 0)
              {
                option.value += delta;
                this.redistribute('remove', option, delta);
              }
              else
              {
                option.value -= delta;
                this.redistribute('add', option, delta);
              }
            }}
          />
        )
      }
    )
  }

  renderSubtotal()
  {
    const {currency} = this.props;
    const subtotal = this.getSubTotal();
    const formattedSubtotal = formatCurrency(subtotal, currency, {compact: true});
    return (
      <div className='flex DonationDistributor-subtotal'>
        <div className='DonationDistributor-subtotal-label flex-auto left-align'>Sub-total</div>
        <div className='DonationDistributor-subtotal-amount'>{formattedSubtotal}</div>
      </div>
    )
  }

  renderCommision()
  {
    const {currency} = this.props;
    const {includeComission, optionalComission} = this.state;
    const comissionAmount = this.getCommissionAmount();
    const formattedComissionAmount = formatCurrency(comissionAmount, currency, {compact: true});
    return (
      <div>
        <div className='DonationDistributor-method-label'>Commission</div>
        <div className='DonationDistributorItem-container' style={{marginTop: 0}}>
          <div className='flex'>
            <div className='flex-auto'>
              <div className='flex flex-column'>
                <div className='flex'>
                  <div>
                    <img src='/static/images/favicon.ico.png' width='16px' height='16px'/>
                  </div>
                  <div className={`flex-auto left-align ${  !optionalComission || includeComission ? '-dashed-bg' : ''}`}>
                    <div className='DonationDistributorItem-label' style={{color: !optionalComission || includeComission ? '#131313' : '#ccc'}}>
                      <div>OpenCollective Comission 5%</div>
                      <div style={{color: '#ccc', display: optionalComission ? 'block': 'none'}}>
                        <i>{includeComission ? 'Wish to Remove?' : 'Wish to Add?'}</i>
                        <a className={includeComission ? '-red-link': '-green-link'} href="#" onClick={this.onCommissionToggleClick.bind(this)}>
                          <i>Yes</i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="DonationDistributorItem-amount">
              <span>{!optionalComission || includeComission ? formattedComissionAmount : '$0'}</span>
            </div>
          </div>
        </div>
      </div>
    )    
  }

  renderMethodPicker()
  {
    const {paymentMethod, optionalPaymentMethod} = this.state;
    const proccesingFee = this.getCreditCardProcessingFee();
    const formattedProccesingFee = formatCurrency(proccesingFee, this.props.currency, {compact: true});
    const usingPayPal = paymentMethod === 'paypal';
    const usingStripe = paymentMethod === 'stripe';

    return (
      <div>
        <div className='DonationDistributor-method-label'>Donation Method</div>
        {(optionalPaymentMethod || usingPayPal) && (
          <div className='DonationDistributorItem-container' style={{marginTop: 0}} onClick={() => this.setState({paymentMethod: 'paypal'})}>
            <div className='flex'>
              <div className='flex-auto'>
                <div className='flex flex-column'>
                  <div className='flex'>
                    <div>
                      <img src={paymentMethod === 'paypal' ? RADIO_ON : RADIO_OFF} width='16px' height='16px'/>
                    </div>
                    <div className={`flex-auto left-align ${paymentMethod === 'paypal' ? '-dashed-bg' : ''}`}>
                      <div className='DonationDistributorItem-label' style={{color: paymentMethod === 'paypal' ? '#131313' : '#ccc'}}>
                        PayPal
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="DonationDistributorItem-amount">
                <span>{paymentMethod === 'paypal' ? '$0' : ''}</span>
              </div>
            </div>
          </div>
        )}
        {(optionalPaymentMethod || usingStripe) && (
          <div className='DonationDistributorItem-container' onClick={() => this.setState({paymentMethod: 'stripe'})}>
            <div className='flex'>
              <div className='flex-auto'>
                <div className='flex flex-column'>
                  <div className='flex'>
                    <div>
                      <img src={paymentMethod === 'stripe' ? RADIO_ON : RADIO_OFF} width='16px' height='16px'/>
                    </div>
                    <div className={`flex-auto left-align ${paymentMethod === 'stripe' ? '-dashed-bg' : ''}`}>
                      <div className='DonationDistributorItem-label' style={{color: paymentMethod === 'stripe' ? '#131313' : '#ccc'}}>
                        Credit Card <i>(proccesing fee)</i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="DonationDistributorItem-amount">
                <span>{paymentMethod === 'stripe' ? formattedProccesingFee : ''}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  renderTotal()
  {
    const {currency} = this.props;
    const totalAmount = this.getSubTotal() + this.getCommissionAmount() + this.getCreditCardProcessingFee();
    const formattedTotalAmount = formatCurrency(totalAmount, currency, {compact: true});
    return (
      <div className='flex DonationDistributor-total'>
        <div className='DonationDistributor-total-label flex-auto left-align'>TOTAL</div>
        <div className='DonationDistributor-total-amount'>{formattedTotalAmount}</div>
      </div>
    )
  }

  renderPaymentButton()
  {
    const {group, inProgress, currency, frequency, onToken} = this.props;
    const stripeKey = this.stripeKey;
    const amount = this.getTotal()
    const formattedAmount = formatCurrency(amount, currency, {compact: true})

    if (this.state.paymentMethod === 'paypal')
    {
      return (
        <AsyncButton
          color='green'
          inProgress={inProgress}
          customClass='btn -btn-big -bg-green -ttu -ff-sec -fw-bold'
          onClick={() => onToken({
            amount,
            frequency,
            currency,
            options: {
              paypal: true
            }            
          })}
          >
          {`Donate ${formattedAmount}`}
        </AsyncButton>
      )
    }
    else if (this.state.paymentMethod === 'stripe')
    {
      return (
        <StripeCheckout
          token={onToken}
          stripeKey={stripeKey}
          name={group.name}
          currency={currency}
          amount={convertToCents(amount)}
          description={this.getStripeDesciption()}>
            <AsyncButton
              color='green'
              inProgress={inProgress}
              customClass='btn -btn-big -bg-green -ttu -ff-sec -fw-bold'>
              {`Donate ${formattedAmount}`}
            </AsyncButton>
        </StripeCheckout>
      )
    }
  }

  renderDisclaimer()
  {
    const {group, i18n, frequency} = this.props;
    const cancellationDisclaimer = (frequency !== 'one-time') ? i18n.getString('cancelAnytime') : '';

    return (
      <h6>
        {i18n.getString('disclaimer')} {group.host.name} {this.getStripeDesciption()} {i18n.getString('for')} {group.name}. {cancellationDisclaimer}
      </h6>
    )
  }

  render() {
    if (!this.state.opened)
    {
      return this.renderDonateButton();
    }

    return (
      <div className='DonationDistributor-mask' onClick={this.onMaskClick.bind(this)}>
        <div className='DonationDistributor-container'>
          <div className='DonationDistributor-header'>
            <h2>You decide how to distribute your</h2>
            <h1>{`$${this.props.amount} ${this.props.frequency}`} donation.</h1>
            <small onClick={this.close.bind(this)}>Edit Donation</small>
          </div>
          <div className='DonationDistributor-body'>
            <div className='DonationDistributor-section'>
              {this.renderCollectives()}
            </div>
            <div className='DonationDistributor-hr' style={{marginTop: '30px'}}></div>
            <div className='DonationDistributor-section'>
              {this.renderSubtotal()}
              {this.renderCommision()}
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

  getTotal()
  {
    return this.getSubTotal() + this.getCreditCardProcessingFee() + this.getCommissionAmount()
  }

  getSubTotal()
  {    
    return this.options.map((opt) => opt.value).reduce((a, b) => a + b) * this.getDistributableAmount(); 
  }

  getCreditCardProcessingFee()
  {
    const {amount} = this.props;
    const {paymentMethod} = this.state;
    return paymentMethod === 'paypal' ? 0 : (0.30 + 0.029 * amount)
  }

  getDistributableAmount()
  {
    const {amount, feesOnTop=true} = this.props;
    return feesOnTop ? amount : amount - this.getCreditCardProcessingFee() - this.getCommissionAmount();
  }

  getCommissionAmount()
  {
    const {optionalComission, includeComission} = this.state;
    return (!optionalComission || includeComission) ? this.props.amount * OC_COMMISSION : 0;
  }

  getStripeDesciption()
  {
    const {group, i18n, donationForm, tier, amount} = this.props;
    const frequency = donationForm[tier.name].frequency || tier.interval;
    const currency = donationForm[tier.name].currency || group.currency;
    const frequencyHuman = frequency === 'one-time' ? '' : `${i18n.getString('per')} ${i18n.getString(frequency.replace(/ly$/,''))}`;
    const proccesingFee = this.getCreditCardProcessingFee() + this.getCommissionAmount()
    const formattedProccesingFee = formatCurrency(proccesingFee, currency, {compact: true});
    const feeDescription = `(+ ${formattedProccesingFee} fees)`;
    return `${formatCurrency(amount, currency, { compact: false })} ${frequencyHuman} ${feeDescription}`;
  }

  redistribute(action, activeOption, delta)
  {
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
      if (action === 'add')
      {
        if (option.value + deltaPiece <= 1)
        {
          option.value += deltaPiece;
        }
        else
        {
          leftOver += deltaPiece - (1 - option.value);
          option.value = 1;
        }
      }
      else if (action === 'remove')
      {
        if (option.value - deltaPiece >= 0)
        {
          option.value -= deltaPiece;
        }
        else
        {
          leftOver += (deltaPiece - option.value);
          option.value = 0;
        }
      }
    });

    // Set values
    this.options.forEach((option) => {
      const index = candidates.indexOf(option);
      if (index !== -1)
      {
        option.value = candidates[index].value;
      }
    });

    if (leftOver > 0.000000000000001)
    {
      this.redistribute(action, activeOption, leftOver)
    }
    else
    {
      this.forceUpdate()
    }
  }

  onCommissionToggleClick(ev)
  {
    this.setState({includeComission: !this.state.includeComission});
    ev.preventDefault();
  }

  onMaskClick(ev)
  {
    if (ev.currentTarget === ev.target)
    {
      this.close();
    }
  }

  open()
  {
    document.body.style.overflow = 'hidden';
    this.setState({opened: true});
  }
  
  close()
  {
    document.body.style.overflow = 'auto';
    this.setState({opened: false});
  }
}
