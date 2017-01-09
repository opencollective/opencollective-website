import React, { Component, PropTypes } from 'react';

import formatCurrency from '../lib/format_currency';
import Select from './Select';

export class RequestMoney extends Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      form: {},
    };
  }

  handleChange(attr, value) {
    if (attr === 'amount') {
      value = value.replace(/[^0-9\.]/g,'');
    }
    const form = this.state.form;
    form[attr] = value;
    const url = this.createRequestMoneyUrl(form.amount, form.interval, form.description);
    this.setState({form, url});
  }

  render() {
    const {
      collective,
      i18n
    } = this.props;

    const amountPlaceholder = formatCurrency(0, collective.currency);
    const intervals = ['one-time','monthly','yearly'];

    return (
      <div className='RequestMoney'>
        <h1>Request money</h1>

        <div className='col col-12 sm-col-12 md-col-6 lg-col-3 pr1'>
          <label>{i18n.getString('amount')}</label>
          <input
            type='text'
            placeholder={amountPlaceholder}
            onChange={event => this.handleChange('amount', event.target.value)} />
        </div>
        <div className="col col-12 sm-col-12 md-col-6 lg-col-3 pl1">
          <label>{i18n.getString('interval')}</label>
          <Select
            customClass='js-transaction-payoutMethod'
            options={intervals.map(i => { return { label: i18n.getString(i), value: i}})}
            handleChange={interval => this.handleChange('interval', interval)} />
        </div>
        <div className='col col-12 sm-col-12 md-col-6 lg-col-6 pl1'>
          <label>{i18n.getString('description')}</label>
          <input
            className='Field'
            type='text'
            onChange={event => this.handleChange('description', event.target.value)}
            maxLength={128} />
        </div>
        {this.state.url && <div className='separator col col-12 sm-col-12 md-col-12 lg-col-12'>URL to share</div> }
        <div className='urlToShare col col-12 sm-col-12 md-col-12 lg-col-12'>
          <a href={this.state.url}>{this.state.url}</a>
        </div>
      </div>
    );
  }

  createRequestMoneyUrl(amount, interval, description) {
    const { collective } = this.props;
    if (!amount > 0) return;
    const intervalurl = (interval !== 'one-time') ? `${interval}/` : '';
    return `https://opencollective.com/${collective.slug}/donate/${amount}/${intervalurl}${encodeURIComponent(description)}`.replace(/\/undefined/g,'');
  }

}


RequestMoney.propTypes = {
  collective: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired
};

export default RequestMoney;
