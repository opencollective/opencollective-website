import React, { Component, PropTypes } from 'react';
import Currency from './Currency';
import Table from 'rc-table';

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
      transactions,
      i18n
    } = this.props;

    const transaction = transactions[0];
    const createdAt = new Date(transaction.createdAt);
    const year = createdAt.getFullYear();
    const month = createdAt.getMonth() + 1;

    const columns = [
      {title: 'date', dataIndex: 'date', className: 'date' },
      {title: 'description', dataIndex: 'description', key: 'description', width: 400},
      {title: 'amount', dataIndex: 'amount', key: 'amount'},
    ];

    let total = 0;
    let currency = 'USD';
    const data = transactions.map(t => {
      total += t.amount;
      currency = t.currency;
      return {
        date: i18n.moment(t.createdAt).format('MM/DD'),
        description: t.description,
        amount: <Currency value={t.amount * 100} currency={t.currency} />
      }
    });

    data.push({
      description: "Total",
      amount: <Currency value={total * 100} currency={currency} />
    });

    return (
      <div className='Invoice'>
          <h1>{i18n.moment(`${year}-${month}`).format('MMMM')} {year} Invoice</h1>
          <div className="reference">Reference: {i18n.moment(createdAt).format('YYYYMM')}-{transaction.GroupId}-{transaction.id}</div>
          <Table columns={columns} data={data} rowClassName={(row, index) => (index === data.length - 1) ? `footer` : ''} />
      </div>
    );
  }
}

Invoice.PropTypes = {
  i18n: PropTypes.object.isRequired,
  transactions: PropTypes.object,
  user: PropTypes.object.isRequired
};