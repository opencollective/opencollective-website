import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import moment from 'moment';

import formatCurrency from '../lib/format_currency';

import payoutMethods from '../ui/payout_methods';

import ImageUpload from './ImageUpload';
import Input from './Input';
import SelectTag from './SelectTag';
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
      transaction,
      group,
      appendTransactionForm,
      i18n
    } = this.props;

    if (!enableVAT) return;

    return (
      <div>
        <span className='inline'>{i18n.getString('vat')}</span>
        <Input
          placeholder={formatCurrency(0, group.currency)}
          hasError={transaction.error.vat}
          value={transaction.attributes.vat}
          handleChange={vat => appendTransactionForm({vat})} />
      </div>
    );
  }

  render() {
    const {
      transaction,
      tags,
      group,
      appendTransactionForm,
      isUploading,
      enableVAT,
      i18n
    } = this.props;

    const attributes = transaction.attributes;

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
          value={attributes.link}
          onFinished={({url: link}) => appendTransactionForm({link})} />
        <form
          name='transaction'
          className='ExpenseForm-form'
          onSubmit={this.onSubmit.bind(this)} >
          <div className='row'>
            <label>{i18n.getString('name')}: </label>
            <Input
              customClass='js-transaction-name'
              hasError={transaction.error.name}
              value={attributes.name}
              handleChange={name => appendTransactionForm({name})} />
          </div>
          <div className='row'>
            <label>{i18n.getString('email')}:</label>
            <Input
              customClass='js-transaction-email'
              hasError={transaction.error.email}
              value={attributes.email}
              handleChange={email => appendTransactionForm({email})} />
          </div>
          <div className='row'>
            <label>{i18n.getString('description')}: </label>
            <Input
              customClass='js-transaction-description'
              hasError={transaction.error.description}
              value={attributes.description}
              handleChange={description => appendTransactionForm({description})} />
          </div>
          <div className='row'>
            <label>{i18n.getString('amount')}: </label>
            <Input
              customClass='js-transaction-amount'
              placeholder={amountPlaceholder}
              hasError={transaction.error.amount}
              value={attributes.amount}
              handleChange={amount => appendTransactionForm({amount})} />
          </div>
          {this.vatInput()}
          <div className='row'>
            <label>{i18n.getString('date')}:</label>
            <DatePicker
              customClass='js-transaction-createdAt'
              selected={moment(attributes.createdAt)}
              maxDate={moment()}
              handleChange={createdAt => appendTransactionForm({createdAt})} />
          </div>
          <div className='row'>
            <label>{i18n.getString('category')}:</label>
            <SelectTag
              customClass='js-transaction-category'
              attributes={attributes}
              tags={tags}
              handleChange={tag => appendTransactionForm({tags: [tag]})} />
          </div>

          <div className='row'>
            <label>{i18n.getString('reimbursementMethod')}:</label>
            <Select
              customClass='js-transaction-payoutMethod'
              options={payoutMethods}
              value={attributes.payoutMethod}
              handleChange={payoutMethod => appendTransactionForm({payoutMethod})} />
          </div>

          {attributes.payoutMethod === 'paypal' && (
            <div className='row'>
              <label>{i18n.getString('paypalEmail')} ({i18n.getString('ifDifferentThanAbove')}):</label>
              <Input
                customClass='js-transaction-paypalEmail'
                hasError={transaction.error.paypalEmail}
                value={attributes.paypalEmail || attributes.email}
                handleChange={paypalEmail => appendTransactionForm({paypalEmail})} />
            </div>
          )}
          <div className='row textarea'>
            <label>{i18n.getString('note')}:</label>
            <TextArea
              customClass='js-transaction-note'
              placeholder='Optional'
              value={attributes.comment}
              handleChange={comment => appendTransactionForm({comment})} />
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
    this.props.onSubmit(this.props.transaction);
  };

  componentDidMount() {
    const {
      tags,
      resetTransactionForm,
      appendTransactionForm,
    } = this.props;

    resetTransactionForm();
    appendTransactionForm({tags: [tags[0]]});

  }
}

ExpenseForm.propTypes = {
  onCancel: PropTypes.func.isRequired
};

export default ExpenseForm;
