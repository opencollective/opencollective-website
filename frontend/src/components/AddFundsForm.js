import React, { Component, PropTypes } from 'react';
import ReactTooltip from 'react-tooltip';

// components
import Input from './Input';
import CustomTextArea from './CustomTextArea';
import AsyncButton from '../components/AsyncButton';

// libs
import formatCurrency from '../lib/format_currency';


class AddFundsForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      areFundsFromHost: true,
      amount: 0,
      fees: 0,
    }
  }

  render() {
    const { attributes, validationError, inProgress, collective, onChange, i18n, onSubmit, host } = this.props;

    const amountPlaceholder = formatCurrency(0, collective.currency);
    const userString = host.name ? `${host.name} (${host.email})` : host.email;
    const netAmount = formatCurrency(this.state.amount + this.state.fees, collective.currency);
    const amountStringInNotice = this.state.amount > 0 ? `(${netAmount})` : 'funds';

    return (
      <div className='AddFundsForm'>
        <h1>{i18n.getString('addFunds')}</h1>
        <p className='notice'>As the host, you can add funds to {collective.name}. The funds will show up immediately in the collective's balance as a donation.</p>
        <div className='line1'>add funds details</div>
        <div className='clearfix input-container'>
          <div className='col col-12 sm-col-12 md-col-6 lg-col-6 pr1'>
            <label>{i18n.getString('amount')}</label>
            <Input
              customClass='js-transaction-amount'
              placeholder={amountPlaceholder}
              hasError={validationError.amount}
              value={attributes.amountText}
              handleChange={amountText => {
                onChange({amountText}); 
                this.onAmountChange(amountText, attributes.fundsFromHost);
              }} />
            <label>{i18n.getString('title')}</label>
            <CustomTextArea
              rows={1}
              resize='vertical'
              customClass='js-transaction-description'
              placeholder='ex: T-shirt sales from Threadless'
              hasError={validationError.title}
              value={attributes.title}
              onChange={title => onChange({title})}
              maxLength={255} />
          </div>
          <div className='col col-12 sm-col-12 md-col-6 lg-col-6 pl1'>
            <label>{i18n.getString('notes')}</label>
            <CustomTextArea
              rows={5}
              resize='vertical'
              customClass='js-transaction-description'
              placeholder='Optional: amount earned by collective from June t-shirt sales'
              hasError={validationError.notes}
              value={attributes.notes}
              onChange={notes => onChange({notes})}
              />
          </div>
        </div>
        <div className='line1'>donor's information</div>
        {attributes.fundsFromHost && 
          <div className='clearfix input-container mb2'>
            <span> {userString} <span className='AddFundsForm-switch ml1' onClick={::this.switchState}> Change source</span></span>
          </div>}
        
        {!attributes.fundsFromHost && 
          <div className='clearfix input-container mb2'>
            <span className='col col-12 pb1'>Tell us who these funds are from. <span className='AddFundsForm-switch ml1' onClick={::this.switchState}> Keep { host.name || host.email } as the donor </span></span>
            <div className='col col-12 sm-col-12 md-col-6 lg-col-6 pr1'>
              <label>{i18n.getString('name')}</label>
              <Input
                customClass='js-transaction-name'
                hasError={validationError.name}
                value={attributes.name}
                handleChange={name => onChange({name})} />
            </div>
            <div className='col col-12 sm-col-12 md-col-6 lg-col-6 pl1'>
              <label>{i18n.getString('email')}</label>
              <Input
                customClass='js-transaction-email'
                hasError={validationError.email}
                value={attributes.email}
                handleChange={email => onChange({email})} />
            </div>
          </div>}

        <div className='line1'>funds breakdown (in USD)</div>
        <div className='clearfix input-container mb2'>
          <div className='col col-12' >
            <span className='col col-4'> Funding amount: </span> 
            <span className='col col-2 AddFundsForm-amount'> {formatCurrency(this.state.amount, collective.currency)}</span>
          </div>
          <div className='col col-12'>
            <span className='col col-4 AddFundsForm-bb'> Host fees {collective.hostFeePercent}%: <img className='help' src='/public/svg/help.svg' data-tip='When the source of funds is not the host, we deduct the usual host fee.'/><ReactTooltip effect='solid' border={true} place='right' /></span>
            <span className='col col-2 AddFundsForm-host-fees'> {formatCurrency(this.state.fees, collective.currency)} </span>
          </div>
          <div className='col col-12'>
            <span className='col col-4 '> Net amount: <img className='help' src='/public/svg/help.svg' data-tip='Funds credited to the collective from this donation'/><ReactTooltip effect='solid' border={true} place='right' /></span>
            <span className='col col-2 AddFundsForm-amount'> {netAmount} </span>
          </div>
        </div>

        <p className='notice'>By clicking below, you agree to set aside { amountStringInNotice } in your bank account on behalf of the collective. </p>
     
        <AsyncButton
          color='green'
          inProgress={inProgress}
          onClick={onSubmit.bind(this)}>
          {i18n.getString('addFunds')}
        </AsyncButton>

      </div>
    )
  }

  switchState() {
    const updatedAreFundsFromDefaultUser = !this.props.attributes.fundsFromHost;
    this.props.onChange({fundsFromHost: updatedAreFundsFromDefaultUser});
    this.onAmountChange(null, updatedAreFundsFromDefaultUser);
  }

  onAmountChange(updatedAmountText, areFundsFromDefaultUser) {
    let amount;
    if (updatedAmountText) {
      amount = Math.round(100 * updatedAmountText);
    } else if (updatedAmountText === '') {
      amount = 0
    } else {
      amount = this.state.amount
    }
    const addFees = !areFundsFromDefaultUser;

    this.setState({
      amount: (amount === '' || isNaN(amount)) ? 0 : amount,
      fees: (addFees && !isNaN(amount)) ? -1*this.props.collective.hostFeePercent/100*amount : 0
    });
  }

}

AddFundsForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  i18n: PropTypes.object.isRequired,
  inProgress: PropTypes.bool.isRequired,
  collective: PropTypes.object.isRequired,
  validationError: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  attributes: PropTypes.object.isRequired,
  host: PropTypes.object
};

export default AddFundsForm;
