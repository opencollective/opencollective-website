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
    const year = createdAt.getFullYear();
    const month = createdAt.getMonth() + 1;

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

    const hostBillingAddress = (transaction.host.billingAddress || '').replace(/\n/g,'<br />');
    const userBillingAddress = (transaction.user.billingAddress || '').replace(/\n/g,'<br />');

    const styles = getGroupCustomStyles(transaction.group);

    return (
      <div className='Invoice'>
         <a href={`https://opencollective.com/${transaction.group.slug}`}>
          <div className="hero">
            <div className="cover" style={styles.hero.cover} />
            <div className="logo" style={{backgroundImage:`url('${transaction.group.logo}')`}} />
          </div>
        </a>
        <div>
          <h1>Invoice</h1>
          <div className="detail"><label>Date:</label> {i18n.moment(createdAt).format('dd MMMM YYYY')}</div>
          <div className="detail reference"><label>Reference:</label> {i18n.moment(createdAt).format('YYYYMM')}-{transaction.GroupId}-{transaction.id}</div>
          <div className="userBillingAddress">
            <span className="label">{i18n.getString('billTo')}:</span><br />
            {transaction.user.name}<br />
            <div dangerouslySetInnerHtml={userBillingAddress} />
          </div>
          <Table columns={columns} data={data} rowClassName={(row, index) => (index === data.length - 1) ? `footer` : ''} />
        </div>

        <div className="footer">
          <a href={transaction.host.website}>
              <img src={transaction.host.avatar} />
          </a><br />
          <div className="hostBillingAddress">
            {transaction.host.name}<br />
            <div dangerouslySetInnerHtml={hostBillingAddress} />
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
