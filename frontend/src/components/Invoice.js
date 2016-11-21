import React, { Component, PropTypes } from 'react';
import Currency from './Currency';
import Table from 'rc-table';
import {getGroupCustomStyles} from '../lib/utils';

export default class Invoice extends Component {

  constructor(props) {
    super(props);
    this.styles = {
      footer: {
        paddingLeft: '480'
      }
    };
  }

  render() {
    const {
      transaction,
      i18n
    } = this.props;

    const createdAt = new Date(transaction.createdAt);

    const columns = [
      {title: 'date', dataIndex: 'date', className: 'date' },
      {title: 'description', dataIndex: 'description', key: 'description', width: 400},
      {title: 'amount', dataIndex: 'amount', key: 'amount'},
    ];

    const data = [{
      date: i18n.moment(transaction.createdAt).format('MM/DD'),
      description: transaction.description,
      amount: <Currency value={transaction.amount * 100} currency={transaction.currency} />
    }];

    data.push({
      description: "Total",
      amount: <Currency value={transaction.amount * 100} currency={transaction.currency} />
    });

    const hostBillingAddress = { __html : (transaction.host.billingAddress || '').replace(/\n/g,'<br />') };
    const userBillingAddress = { __html : (transaction.user.billingAddress || '').replace(/\n/g,'<br />') };
    console.log("transaction", transaction);
    console.log("hostBillingAddress", hostBillingAddress);
    const styles = getGroupCustomStyles(transaction.group);

    return (
      <div className='Invoice'>

        <div className="header">
          <a href={`https://opencollective.com/${transaction.group.slug}`}>
            <div className="hero">
              <div className="cover" style={styles.hero.cover} />
              <div className="logo" style={{backgroundImage:`url('${transaction.group.logo}')`}} />
            </div>
          </a>

          <div className="collectiveInfo">
            <h1>{transaction.group.name}</h1>
            <a href={`https://opencollective.com/${transaction.group.slug}`} className="website">https://opencollective.com/{transaction.group.slug}</a>
          </div>
        </div>

        <div className="row">
          <div className="userBillingAddress">
            <h2>{i18n.getString('billTo')}:</h2>
            {transaction.user.name}<br />
            <div dangerouslySetInnerHTML={userBillingAddress} />
          </div>
          <div className="invoiceDetails">
            <h2>Invoice</h2>
            <div className="detail"><label>Date:</label> {i18n.moment(createdAt).format('D MMMM YYYY')}</div>
            <div className="detail reference"><label>Reference:</label> {i18n.moment(createdAt).format('YYYYMM')}-{transaction.GroupId}-{transaction.id}</div>
          </div>
        </div>

        <Table columns={columns} data={data} rowClassName={(row, index) => (index === data.length - 1) ? `footer` : ''} />

        <div className="footer">
          <a href={transaction.host.website}>
              <img src={transaction.host.avatar} />
          </a><br />
          <div className="hostBillingAddress">
            {transaction.host.name}<br />
            <div dangerouslySetInnerHTML={hostBillingAddress} />
          </div>
        </div>
      </div>
    );
  }
}

Invoice.PropTypes = {
  i18n: PropTypes.object.isRequired,
  transaction: PropTypes.object.isRequired
};
