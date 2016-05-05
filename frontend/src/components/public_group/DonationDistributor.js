import React, { Component, PropTypes } from 'react';
import DonationDistributorItem from './DonationDistributorItem';
import StripeCheckout from 'react-stripe-checkout';
import AsyncButton from '../AsyncButton';
import formatCurrency, {currencySymbolLookup} from '../../lib/format_currency';
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
    frequency: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    const {group, method, amount, optionalComission=false} = this.props;
    this.stripeKey = group.stripeAccount && group.stripeAccount.stripePublishableKey ? group.stripeAccount.stripePublishableKey : '';
    const hasPaypal = group.hasPaypal;
    const hasStripe = this.stripeKey && amount;
    this.state = {
      disabled: !hasPaypal && !hasStripe,
      paymentMethod: method,
      optionalComission: optionalComission,
      commisionPercentage: 100,
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
    return (
      <DonationDistributorItem 
        className='-no-dashed-bg --subtotal'
        currency={this.props.currency}
        label='Sub-total'
        editable={false}
        amount={this.getSubTotal()}
        onChange={Function.prototype}
      />
    )
  }

  renderCommision()
  {
    const {currency} = this.props;
    const {optionalComission} = this.state;
    return (
      <DonationDistributorItem 
        className='-no-dashed-bg'
        currency={currency}
        label='OpenCollective Comission 5%'
        editable={optionalComission}
        editableAmount={optionalComission}
        amount={this.props.amount * OC_COMMISSION}
        value={this.state.commisionPercentage}
        onChange={(percent) => {
          this.setState({commisionPercentage: percent});
        }}
      />
    )
  }

  renderMethodPicker()
  {
    const {currency} = this.props;
    const {paymentMethod, optionalPaymentMethod} = this.state;
    const proccesingFee = this.getCreditCardProcessingFee();
    const formattedProccesingFee = formatCurrency(proccesingFee, currency, {compact: true});
    const usingPayPal = paymentMethod === 'paypal';
    const usingStripe = paymentMethod === 'stripe';

    return (
      <div>
        <div className='DonationDistributor-method-label'>Donation Method</div>
        {(optionalPaymentMethod || usingPayPal) && (
          <div className='DonationDistributorItem-container --paypal' style={{marginTop: 0}} onClick={() => this.setState({paymentMethod: 'paypal'})}>
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
                <span>{paymentMethod === 'paypal' ? formattedProccesingFee: ''}</span>
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
    return (
      <DonationDistributorItem 
        className='-no-dashed-bg --total'
        currency={currency}
        label='Total'
        editable={false} 
        amount={totalAmount}
      />
    )
  }

  renderPaymentButton()
  {
    const {group, inProgress, currency, frequency, onToken} = this.props;
    const stripeKey = this.stripeKey;
    const amount = (this.getSubTotal() + this.getCommissionAmount()).toFixed(2);
    const formattedAmount = formatCurrency(amount, currency, {compact: true});
    const distribution = this.options.map((opt) => { return {id: opt.id, value: opt.value} });

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
              paypal: true,
              distribution
            },
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
              onClick={this.close.bind(this)}
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
            <h2>{this.options.length > 1 && this.props.editable ? 'You decide how to distribute your' : 'Please confirm your'}</h2>
            <h1>{`${currencySymbolLookup[this.props.currency]}${this.props.amount} ${this.props.frequency}`} donation.</h1>
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
    return this.getSubTotal() + this.getCreditCardProcessingFee() + this.getCommissionAmount();
  }

  getSubTotal()
  {    
    return this.options.map((opt) => opt.value).reduce((a, b) => a + b) * this.getDistributableAmount(); 
  }

  getCreditCardProcessingFee()
  {
    const {amount} = this.props;
    const {paymentMethod} = this.state;
    return paymentMethod === 'paypal' ? 0 : (0.30 + 0.029 * amount);
  }

  getDistributableAmount()
  {
    const {amount, feesOnTop=true} = this.props;
    return feesOnTop ? amount : amount - this.getCreditCardProcessingFee() - this.getCommissionAmount();
  }

  getCommissionAmount()
  {
    const {commisionPercentage} = this.state;
    return (this.props.amount * OC_COMMISSION) * (commisionPercentage/100);
  }

  getStripeDesciption()
  {
    const {i18n, currency, frequency} = this.props;
    const frequencyHuman = frequency === 'one-time' ? '' : `${i18n.getString('per')} ${i18n.getString(frequency.replace(/ly$/,''))}`;
    const proccesingFee = this.getCreditCardProcessingFee();
    const formattedProccesingFee = formatCurrency(proccesingFee, currency, {compact: true}); 
    const formattedAmount = formatCurrency(this.getSubTotal() + this.getCommissionAmount(), currency, { compact: false });
    const feeDescription = proccesingFee ? `(+\u00A0${formattedProccesingFee}\u00A0fees)` : ''; 
    return `${formattedAmount} ${frequencyHuman} ${feeDescription}`;
  }

  resetOptions()
  {
    const {collectives, editable} = this.props;
    this.options = collectives.map((collective) => {
      return {
        id: collective.id,
        label: collective.name, 
        icon: collective.logo, 
        editable: editable,
        value: !isNaN(collective.value) ? collective.value : 1 / collectives.length
      }
    });
    this.setState({commisionPercentage: 100});
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
    this.resetOptions();
    this.setState({opened: true});
  }
  
  close()
  {
    document.body.style.overflow = 'auto';
    this.setState({opened: false});
  }
}
