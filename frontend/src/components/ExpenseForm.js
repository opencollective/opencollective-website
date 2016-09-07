import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import formatCurrency from '../lib/format_currency';
import env from '../lib/env';

import payoutMethods from '../ui/payout_methods';

import ImageUpload from './ImageUpload';
import Input from './Input';
import SelectCategory from './SelectCategory';
import Select from './Select';
import CustomTextArea from './CustomTextArea';
import Notification from '../containers/Notification';

class ExpenseForm extends Component {

  vatInput() {
    const { enableVAT, expense, group, appendExpenseForm, i18n } = this.props;
    if (!enableVAT) return;
    return (
      <div>
        <label>{i18n.getString('vat')}</label>
        <Input
          placeholder={formatCurrency(0, group.currency)}
          hasError={expense.error.vat}
          value={expense.attributes.vat}
          handleChange={vat => appendExpenseForm({vat})} />
      </div>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      prefilled: false,
    };
  }

  render() {
    const { expense, categories, group, appendExpenseForm, isUploading, enableVAT, i18n, user } = this.props;
    const { prefilled } = this.state;
    const { attributes } = expense;
    const hasAttachment = env.NODE_ENV !== 'production' || attributes.attachment;
    const className = classnames({
      'ExpenseForm': true,
      'ExpenseForm--isUploading': isUploading,
      'js-form': true, // for testing
    });
    let amountPlaceholder = formatCurrency(0, group.currency);
    if (enableVAT) {
      amountPlaceholder += ' (including VAT)';
    }

    if (user && !prefilled) {
      attributes.name = user.name;
      attributes.email = user.email;
      if (user.paypalEmail) {
        attributes.paypalEmail = user.paypalEmail;
      }
      this.setState({prefilled: true});
    }

    return (
      <div className={className}>
        <Notification {...this.props} autoclose/>
        <div className='line1'>expense details</div>
        <div className='clearfix input-container'>
          <div className='col col-12 sm-col-12 md-col-6 lg-col-6 pr1'>
            <ImageUpload
              {...this.props}
              uploading={null}
              value={attributes.attachment}
              onFinished={({url: attachment}) => appendExpenseForm({attachment})}
              noDefaultImage />
          </div>
          <div className='col col-12 sm-col-12 md-col-6 lg-col-6 pl1 mt0'>
            <label>{i18n.getString('amount')}</label>
            <Input
              customClass='js-transaction-amount'
              placeholder={amountPlaceholder}
              hasError={expense.error.amountText}
              value={attributes.amountText}
              handleChange={amountText => appendExpenseForm({amountText})} />
            {this.vatInput()}
            <label>{i18n.getString('category')}</label>
            <SelectCategory
              customClass='js-transaction-category'
              attributes={attributes}
              categories={categories}
              handleChange={category => appendExpenseForm({category})} />
            <label>{i18n.getString('description')}</label>
            <CustomTextArea
              rows='1'
              resize='vertical'
              customClass='js-transaction-description'
              hasError={expense.error.title}
              value={attributes.title}
              onChange={title => appendExpenseForm({title})}
              maxLength={255} />
          </div>
        </div>
        <div className='line1'>your information</div>
        <div className='clearfix input-container'>
          <div className='col col-12 sm-col-12 md-col-6 lg-col-6 pr1'>
            <label>{i18n.getString('name')}</label>
            <Input
              customClass='js-transaction-name'
              hasError={expense.error.name}
              value={attributes.name}
              handleChange={name => appendExpenseForm({name})} />
          </div>
          <div className='col col-12 sm-col-12 md-col-6 lg-col-6 pl1'>
            <label>{i18n.getString('email')}</label>
            <Input
              disabled={user && user.email}
              customClass='js-transaction-email'
              hasError={expense.error.email}
              value={attributes.email}
              handleChange={email => appendExpenseForm({email})} />
          </div>

          <div className='col col-12 sm-col-12 md-col-6 lg-col-6  pr1'>
            <label>{i18n.getString('reimbursementMethod')}</label>
            <Select
              customClass='js-transaction-payoutMethod'
              options={payoutMethods(group.settings.lang)}
              value={attributes.payoutMethod}
              handleChange={payoutMethod => appendExpenseForm({payoutMethod})} />
          </div>

          {attributes.payoutMethod === 'paypal' && (

          <div className='col col-12 sm-col-12 md-col-6 lg-col-6  pl1'>
            <label>Paypal Email</label>
            <Input
              customClass='js-transaction-paypalEmail'
              hasError={expense.error.paypalEmail}
              value={attributes.paypalEmail || attributes.email}
              handleChange={paypalEmail => appendExpenseForm({paypalEmail})} />
          </div>
          )}
        </div>
        <button type='submit' className={`Button ${hasAttachment ? 'Button--green' : 'Button--disabled'}`} onClick={hasAttachment && this.onSubmit.bind(this)}>submit expense</button>
      </div>
    )
  }

  onCancel(event) {
    event.preventDefault();
    this.props.onCancel();
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.onSubmit(this.props.expense);
  }

  componentDidMount() {
    const { categories, resetExpenseForm, appendExpenseForm } = this.props;
    resetExpenseForm();
    appendExpenseForm({category: categories[0]});
  }
}

ExpenseForm.propTypes = {
  onCancel: PropTypes.func.isRequired
};

export default ExpenseForm;
