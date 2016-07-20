import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import moment from 'moment';

import formatCurrency from '../lib/format_currency';

import payoutMethods from '../ui/payout_methods';

import ImageUpload from './ImageUpload';
import Input from './Input';
import SelectCategory from './SelectCategory';
import Select from './Select';
import TextArea from './TextArea';
import Notification from '../containers/Notification';
import SubmitButton from './SubmitButton';
import Button from './Button';
import DatePicker from './DatePicker';
import Currency from './Currency';

class ExpenseForm extends Component {

  vatInput() {
    const { enableVAT, expense, group, appendExpenseForm, i18n } = this.props;
    if (!enableVAT) return;
    return (
      <div>
        <span className='inline'>{i18n.getString('vat')}</span>
        <Input
          placeholder={formatCurrency(0, group.currency)}
          hasError={expense.error.vat}
          value={expense.attributes.vat}
          handleChange={vat => appendExpenseForm({vat})} />
      </div>
    );
  }

  render() {
    const { expense, categories, group, appendExpenseForm, isUploading, enableVAT, i18n } = this.props;
    const attributes = expense.attributes;
    const className = classnames({
      'ExpenseForm': true,
      'ExpenseForm--isUploading': isUploading,
      'js-form': true, // for testing
    });
    let amountPlaceholder = formatCurrency(0, group.currency);
    if (enableVAT) {
      amountPlaceholder += ' (including VAT)';
    }

    return (
      <div className='ExpenseForm'>
        <Notification {...this.props} />
        <div className='line1'>collective information</div>
        <div className='info-block mr3'>
          <div className='info-block-value'>{group.name}</div>
          <div className='info-block-label'>collective</div>
        </div>
        <div className='info-block'>
          <div className='info-block-value'>
            <Currency value={group.balance/100} currency={group.currency} precision={2} />
          </div>
          <div className='info-block-label'>funds</div>
        </div>
        <div className='line1'>expense details</div>
        <div className="clearfix input-container">
          <div className="col col-6 pr1">
            <ImageUpload
              {...this.props}
              value={attributes.attachment}
              onFinished={({url: attachment}) => appendExpenseForm({attachment})}
            />
          </div>
          <div className="col col-6 pl1">
            <label>amount</label>
            <Input
              customClass='js-transaction-amount'
              placeholder={amountPlaceholder}
              hasError={expense.error.amountText}
              value={attributes.amountText}
              handleChange={amountText => appendExpenseForm({amountText})} />
            <label>category</label>
            <SelectCategory
              customClass='js-transaction-category'
              attributes={attributes}
              categories={categories}
              handleChange={category => appendExpenseForm({category})} />
            <label>description (optional)</label>
            <Input
              customClass='js-transaction-description'
              hasError={expense.error.title}
              value={attributes.title}
              handleChange={title => appendExpenseForm({title})} />
          </div>
        </div>
        <div className='line1'>your information</div>
        <div className="clearfix input-container">
          <div className="col col-6 pr1">
            <label>name</label>
            <Input
              customClass='js-transaction-name'
              hasError={expense.error.name}
              value={attributes.name}
              handleChange={name => appendExpenseForm({name})}
            />
          </div>
          <div className="col col-6 pl1">
            <label>email</label>
            <Input
              customClass='js-transaction-email'
              hasError={expense.error.email}
              value={attributes.email}
              handleChange={email => appendExpenseForm({email})} />
          </div>

          <div className="col col-6 pr1">
            <label>reinbursment method</label>
            <Select
              customClass='js-transaction-payoutMethod'
              options={payoutMethods(group.settings.lang)}
              value={attributes.payoutMethod}
              handleChange={payoutMethod => appendExpenseForm({payoutMethod})} />
          </div>

          {attributes.payoutMethod === 'paypal' && (
            
          <div className="col col-6 pl1">
            <label>PayPal account/ Account number</label>
            <Input
              customClass='js-transaction-paypalEmail'
              hasError={expense.error.paypalEmail}
              value={attributes.paypalEmail || attributes.email}
              handleChange={paypalEmail => appendExpenseForm({paypalEmail})} />
          </div>
          )}
        </div>
        <div className="Button Button--green">submit expense</div>
      </div>
    )
  }

  onCancel(event) {
    event.preventDefault();
    this.props.onCancel();
  };

  onSubmit(event) {
    event.preventDefault();
    this.props.onSubmit(this.props.expense);
  };

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
