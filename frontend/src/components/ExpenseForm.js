import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import moment from 'moment';

import formatCurrency from '../lib/format_currency';

import payoutMethods from '../ui/payout_methods';

import ImageUpload from './ImageUpload';
import Input from './Input';
import SelectTag from './SelectCategory';
import Select from './Select';
import TextArea from './TextArea';
import Notification from '../containers/Notification';
import SubmitButton from './SubmitButton';
import Button from './Button';
import DatePicker from './DatePicker';

class ExpenseForm extends Component {

  vatInput() {
    const {
      enableVAT,
      expense,
      group,
      appendExpenseForm,
      i18n
    } = this.props;

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
    const {
      expense,
      categories,
      group,
      appendExpenseForm,
      isUploading,
      enableVAT,
      i18n
    } = this.props;

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
      <div className={className}>
        <Notification {...this.props} />
        <ImageUpload
          {...this.props}
          value={attributes.attachment}
          onFinished={({url: attachment}) => appendExpenseForm({attachment})} />
        <form
          name='expense'
          className='ExpenseForm-form'
          onSubmit={this.onSubmit.bind(this)} >
          <div className='row'>
            <label>{i18n.getString('name')}: </label>
            <Input
              customClass='js-transaction-name'
              hasError={expense.error.name}
              value={attributes.name}
              handleChange={name => appendExpenseForm({name})} />
          </div>
          <div className='row'>
            <label>{i18n.getString('email')}:</label>
            <Input
              customClass='js-transaction-email'
              hasError={expense.error.email}
              value={attributes.email}
              handleChange={email => appendExpenseForm({email})} />
          </div>
          <div className='row'>
            <label>{i18n.getString('description')}: </label>
            <Input
              customClass='js-transaction-description'
              hasError={expense.error.title}
              value={attributes.title}
              handleChange={title => appendExpenseForm({title})} />
          </div>
          <div className='row'>
            <label>{i18n.getString('amount')}: </label>
            <Input
              customClass='js-transaction-amount'
              placeholder={amountPlaceholder}
              hasError={expense.error.amountText}
              value={attributes.amountText}
              handleChange={amountText => appendExpenseForm({amountText})} />
          </div>
          {this.vatInput()}
          <div className='row'>
            <label>{i18n.getString('date')}:</label>
            <DatePicker
              customClass='js-transaction-createdAt'
              selected={moment(attributes.incurredAt)}
              maxDate={moment()}
              handleChange={incurredAt => appendExpenseForm({incurredAt})} />
          </div>
          <div className='row'>
            <label>{i18n.getString('category')}:</label>
            <SelectTag
              customClass='js-transaction-category'
              attributes={attributes}
              categories={categories}
              handleChange={category => appendExpenseForm({category})} />
          </div>

          <div className='row'>
            <label>{i18n.getString('reimbursementMethod')}:</label>
            <Select
              customClass='js-transaction-payoutMethod'
              options={payoutMethods}
              value={attributes.payoutMethod}
              handleChange={payoutMethod => appendExpenseForm({payoutMethod})} />
          </div>

          {attributes.payoutMethod === 'paypal' && (
            <div className='row'>
              <label>{i18n.getString('paypalEmail')} ({i18n.getString('ifDifferentThanAbove')}):</label>
              <Input
                customClass='js-transaction-paypalEmail'
                hasError={expense.error.paypalEmail}
                value={attributes.paypalEmail || attributes.email}
                handleChange={paypalEmail => appendExpenseForm({paypalEmail})} />
            </div>
          )}
          <div className='row textarea'>
            <label>{i18n.getString('note')}:</label>
            <TextArea
              customClass='js-transaction-note'
              placeholder='Optional'
              value={attributes.notes}
              handleChange={notes => appendExpenseForm({notes})} />
          </div>

          <div className="buttonsRow">
            <SubmitButton />
            <Button color="red" label="Cancel" onClick={this.onCancel.bind(this)} />
          </div>

        </form>
      </div>
    );
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
    const {
      categories,
      resetExpenseForm,
      appendExpenseForm,
    } = this.props;

    resetExpenseForm();
    appendExpenseForm({category: categories[0]});

  }
}

ExpenseForm.propTypes = {
  onCancel: PropTypes.func.isRequired
};

export default ExpenseForm;
